#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Pin the source inspected in research/writing-research.md; do not import its mandatory skill.
export const CODEHYGIENE_SOURCE = "https://github.com/brianbell-x/codehygiene/archive/423c7e1f02ef409bbaea209268bfcde36e0f1cb0.tar.gz";

export function installCodehygiene(run = spawnSync) {
  const result = run("uv", [
    "tool", "install", "--no-python-downloads", `codehygiene @ ${CODEHYGIENE_SOURCE}`
  ], { stdio: "inherit" });
  if (result.error) {
    throw new Error(`Could not start uv: ${result.error.message}. Install uv and Python 3.10+ before retrying.`);
  }
  if (result.status !== 0) {
    throw new Error(`codehygiene installation failed (${result.signal ?? result.status}); see uv's output. Existing installations were not forcibly replaced.`);
  }
}

const observations = {
  deep_nesting: "Indented structure; inspect control flow separately from view or data nesting.",
  poor_naming: "Naming pattern; check the name against its domain and use.",
  noisy_comment: "Comment pattern; check whether it explains a reason or obligation.",
  swallowed_error: "Error-handling or default-value pattern; check whether an error is actually ignored.",
  dense_line: "Dense line; inspect whether splitting it would improve understanding.",
  special_casing: "Branch pattern; check whether the domain needs each case.",
  duplicate_block: "Similar text; check whether it represents the same responsibility.",
  cramped_layout: "Layout pattern; inspect readability in the source language.",
};

export function reviewCandidates(source, rawFindings, changedRanges = null) {
  const lines = source.split(/\r\n|[\n\v\f\r\x1c-\x1e\u0085\u2028\u2029]/u);
  if (!source || lines.at(-1) === "") lines.pop();
  const encoded = lines.slice(0, 2048);
  const wideLines = encoded.flatMap((line, index) => {
    let column = 0;
    for (const char of line) column += char === "\t" ? 2 - column % 2 : 1;
    return column > 128 ? [index + 1] : [];
  });
  const nonAsciiLines = encoded.flatMap((line, index) => /[^\x00-\x7f]/u.test(line) ? [index + 1] : []);
  const selected = rawFindings.filter(({ line }) => changedRanges === null
    || changedRanges.some(([start, end]) => line >= start && line <= end));
  return {
    status: "needs-review",
    scope: changedRanges === null ? "whole-file" : "changed-lines",
    coverage: {
      totalLines: lines.length, encodedLines: encoded.length,
      unreadLines: Math.max(0, lines.length - 2048), clippedLines: wideLines,
      nonAsciiLines, complete: lines.length <= 2048 && !wideLines.length && !nonAsciiLines.length,
    },
    candidates: selected.map(({ line, kind }) => ({ line, kind, observation: observations[kind] ?? "Unrecognised upstream pattern; inspect raw findings." })),
    outsideChangedLines: rawFindings.length - selected.length,
    rawFindings,
  };
}

export function scanCodehygiene(files, { base, cwd = process.cwd(), run = spawnSync } = {}) {
  cwd = realpathSync(cwd);
  function command(program, args, input) {
    const result = run(program, args, { cwd, input, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${program} failed: ${result.stderr?.trim() || result.status}`);
    return result.stdout;
  }
  if (!files.length) throw new Error("Provide explicit source file paths to scan.");
  const version = command("codehygiene", ["--version"]).trim();
  if (version !== "codehygiene 0.4.0") throw new Error(`Expected codehygiene 0.4.0; got ${version}. Recheck encoding limits before using another version.`);
  const repository = base === undefined ? null : command("git", ["rev-parse", "--show-toplevel"]).trim();
  const commit = base === undefined ? null : command("git", ["rev-parse", "--verify", "--end-of-options", `${base}^{commit}`]).trim();
  return {
    tool: version, baseCommit: commit,
    interpretation: "Unverified patterns, not defects. No quality grade or automatic fixes. Changed-line focus may omit related context; raw findings remain available.",
    files: files.map((file) => {
      const path = realpathSync(resolve(cwd, file));
      let ranges = null;
      if (repository) {
        const local = relative(repository, path);
        if (local === ".." || local.startsWith("../") || local.startsWith("..\\") || isAbsolute(local)) {
          throw new Error(`File is outside the comparison repository: ${file}`);
        }
        const tracked = command("git", ["--literal-pathspecs", "ls-files", "--", path]).trim();
        if (tracked) {
          const diff = command("git", ["--literal-pathspecs", "diff", "--no-ext-diff", "--no-textconv", "--unified=0", commit, "--", path]);
          ranges = [...diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)]
            .map((match) => [Number(match[1]), Number(match[1]) + Number(match[2] ?? 1) - 1]);
        }
      }
      const source = readFileSync(path, "utf8");
      const raw = JSON.parse(command("codehygiene", ["--json"], source));
      if (!Array.isArray(raw.squiggles)) throw new Error(`Unexpected Codehygiene output for ${file}`);
      return { file: path, ...reviewCandidates(source, raw.squiggles, ranges) };
    }),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    const [action, ...args] = process.argv.slice(2);
    if (action === "install" && !args.length) installCodehygiene();
    else if (action === "scan") {
      const base = args[0] === "--base" ? args.splice(0, 2)[1] : undefined;
      if (args.some((arg) => arg.startsWith("-"))) throw new Error("Options must precede file paths; use ./ for filenames beginning with a dash.");
      process.stdout.write(`${JSON.stringify(scanCodehygiene(args, { base }), null, 2)}\n`);
    } else throw new Error("Usage: node codehygiene.mjs install | scan [--base REF] FILE...");
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
