#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const MAX_PROFILE_CHARS = 6000;

const ROUTE = "Before a change where repository facts could change the implementation, invoke `$simple` and read the nearest `SIMPLE.md`. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `plan`, `review`, or `check` for an explicit Simple workflow.";
const PROFILE_TEMPLATE_PATH = new URL("../assets/SIMPLE.template.md", import.meta.url);
const PROFILE = readFileSync(PROFILE_TEMPLATE_PATH, "utf8");
const REQUIRED_HEADINGS = [...PROFILE.matchAll(/^## .+$/gm)].map(([heading]) => heading);

export function check(root = process.cwd()) {
  const failures = [];
  const agentsPath = resolve(root, "AGENTS.md");
  const claudePath = resolve(root, "CLAUDE.md");
  const profilePath = resolve(root, "SIMPLE.md");
  const agents = read(agentsPath, failures);
  const claude = read(claudePath, failures);
  const profile = read(profilePath, failures);

  if (agents && (!agents.includes("$simple") || !agents.includes("SIMPLE.md"))) {
    failures.push("AGENTS.md must route repository-dependent decisions to $simple and SIMPLE.md");
  }
  if (claude && !claude.includes("AGENTS.md") && (!claude.includes("$simple") || !claude.includes("SIMPLE.md"))) {
    failures.push("CLAUDE.md must import or route through AGENTS.md and SIMPLE.md");
  }

  for (const heading of REQUIRED_HEADINGS) {
    if (profile && !profile.includes(heading)) failures.push(`SIMPLE.md is missing ${heading}`);
  }

  if (profile.length > MAX_PROFILE_CHARS) {
    failures.push(`SIMPLE.md exceeds ${MAX_PROFILE_CHARS} characters; move specialist detail beside the code or into focused documentation`);
  }
  if (profile.includes("simple-profile: incomplete")) {
    failures.push("SIMPLE.md is incomplete; replace setup prompts with observed facts and remove the incomplete marker");
  }
  if (/\b(?:TODO|TBD|FIXME)\b/.test(profile)) failures.push("SIMPLE.md contains an unresolved placeholder");
  return failures;
}

export function init(root = process.cwd()) {
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

  if (!existsSync(profilePath)) writeFileSync(profilePath, PROFILE);
}

export const setup = init;

function read(path, failures) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    failures.push(`missing ${path}`);
    return "";
  }
}

function print(failures, failProcess = true) {
  process.stdout.write(`${JSON.stringify({ ok: failures.length === 0, ready: failures.length === 0, failures }, null, 2)}\n`);
  if (failProcess && failures.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command = "check", directory = process.cwd()] = process.argv.slice(2);
  if (command === "init" || command === "setup") {
    init(resolve(directory));
    print(check(resolve(directory)), false);
  } else if (command === "check") {
    print(check(resolve(directory)));
  } else {
    process.stderr.write("Usage: simple.mjs <init|check> [repository]\n");
    process.exitCode = 2;
  }
}
