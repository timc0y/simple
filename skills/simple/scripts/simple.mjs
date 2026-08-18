#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROUTE = "For non-trivial design or implementation, invoke `$simple` and read the nearest `SIMPLE.md`. Design for observed reality, not imagined obligations.";

export function check(root = process.cwd()) {
  const failures = [];
  const agentsPath = resolve(root, "AGENTS.md");
  const claudePath = resolve(root, "CLAUDE.md");
  const profilePath = resolve(root, "SIMPLE.md");
  const agents = read(agentsPath, failures);
  const claude = read(claudePath, failures);
  const profile = read(profilePath, failures);

  if (agents && (!agents.includes("$simple") || !agents.includes("SIMPLE.md"))) {
    failures.push("AGENTS.md must route non-trivial design to $simple and SIMPLE.md");
  }
  if (claude && !claude.includes("AGENTS.md") && (!claude.includes("$simple") || !claude.includes("SIMPLE.md"))) {
    failures.push("CLAUDE.md must import or route through AGENTS.md and SIMPLE.md");
  }

  for (const heading of ["## Reality", "## Architecture boundary", "## Deletion proof"]) {
    if (profile && !profile.includes(heading)) failures.push(`SIMPLE.md is missing ${heading}`);
  }

  const precedents = profile.split(/^## Precedent:/m).slice(1);
  for (const [index, precedent] of precedents.entries()) {
    for (const field of ["Need:", "Tempting complexity:", "Observed native fact:", "Simple solution:", "Why sufficient here:", "Invalidation condition:", "Concepts avoided:"]) {
      if (!precedent.includes(field)) failures.push(`SIMPLE.md precedent ${index + 1} is missing ${field}`);
    }
  }

  if (/\b(?:TODO|TBD|FIXME)\b/.test(profile)) failures.push("SIMPLE.md contains an unresolved placeholder");
  return failures;
}

export function setup(root = process.cwd()) {
  const agentsPath = resolve(root, "AGENTS.md");
  const claudePath = resolve(root, "CLAUDE.md");
  const profilePath = resolve(root, "SIMPLE.md");
  const agents = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : "";

  if (!agents.includes("$simple") || !agents.includes("SIMPLE.md")) {
    writeFileSync(agentsPath, `${agents.trimEnd()}${agents.trim() ? "\n\n" : ""}## Simple\n\n${ROUTE}\n`);
  }

  const claude = existsSync(claudePath) ? readFileSync(claudePath, "utf8") : "";
  if (!claude.includes("AGENTS.md") && (!claude.includes("$simple") || !claude.includes("SIMPLE.md"))) {
    writeFileSync(claudePath, `${claude.trimEnd()}${claude.trim() ? "\n\n" : ""}@AGENTS.md\n`);
  }

  if (!existsSync(profilePath)) {
    writeFileSync(profilePath, `# Simple profile\n\n## Reality\n\nRecord observed users, operators, consumers, data, compatibility, scale and failure consequences.\n\n## Architecture boundary\n\nState what this repository is and is not.\n\n## Deletion proof\n\nRecord the commands and independent surfaces that prove safe deletion.\n`);
  }
}

function read(path, failures) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    failures.push(`missing ${path}`);
    return "";
  }
}

function print(failures) {
  process.stdout.write(`${JSON.stringify(failures.length ? { ok: false, failures } : { ok: true }, null, 2)}\n`);
  if (failures.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command = "check", directory = process.cwd()] = process.argv.slice(2);
  if (command === "setup") {
    setup(resolve(directory));
    print(check(resolve(directory)));
  } else if (command === "check") {
    print(check(resolve(directory)));
  } else {
    process.stderr.write("Usage: simple.mjs <setup|check> [repository]\n");
    process.exitCode = 2;
  }
}
