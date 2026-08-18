#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const MAX_PROFILE_CHARS = 6000;

const ROUTE = "Before non-trivial development, invoke `$simple` and read the nearest `SIMPLE.md`. Repository facts override speculative compatibility, migration, and scale concerns.";

const PROFILE = `# Simple

## Reality

- Stage and users: Establish before designing compatibility or migrations.
- Operators: Establish from repository ownership and delivery practice.
- External consumers: Establish from published interfaces and downstream use.
- Public contracts: Establish from APIs, packages, URLs, files, and automation.
- Persistent production data: Establish before deleting or replacing schemas.
- Compatibility commitments: Establish from actual consumers and promises.
- Scale and failure consequences: Establish from current operation, not forecasts.

## Preserve

- Record hard-won domain, operational, security, or recovery knowledge.

## Does not need yet

- Record specific complexity that current evidence does not justify.

## Ordinary paths

- Record the existing owners and workflows agents should reuse.

## Proof

- Record commands and independent surfaces that verify changes.

## Reconsider when

- Record observable conditions that would justify more complexity.
`;

const REQUIRED_HEADINGS = [
  "## Reality",
  "## Preserve",
  "## Does not need yet",
  "## Ordinary paths",
  "## Proof",
  "## Reconsider when"
];

const PRECEDENT_FIELDS = [
  "Need:",
  "Tempting complexity:",
  "Observed fact:",
  "Simple solution:",
  "Why sufficient here:",
  "Reconsider when:",
  "Concepts avoided:"
];

export function check(root = process.cwd()) {
  const failures = [];
  const agentsPath = resolve(root, "AGENTS.md");
  const claudePath = resolve(root, "CLAUDE.md");
  const profilePath = resolve(root, "SIMPLE.md");
  const agents = read(agentsPath, failures);
  const claude = read(claudePath, failures);
  const profile = read(profilePath, failures);

  if (agents && (!agents.includes("$simple") || !agents.includes("SIMPLE.md"))) {
    failures.push("AGENTS.md must route non-trivial development to $simple and SIMPLE.md");
  }
  if (claude && !claude.includes("AGENTS.md") && (!claude.includes("$simple") || !claude.includes("SIMPLE.md"))) {
    failures.push("CLAUDE.md must import or route through AGENTS.md and SIMPLE.md");
  }

  for (const heading of REQUIRED_HEADINGS) {
    if (profile && !profile.includes(heading)) failures.push(`SIMPLE.md is missing ${heading}`);
  }

  const precedents = profile.split(/^## Precedent:/m).slice(1);
  for (const [index, precedent] of precedents.entries()) {
    for (const field of PRECEDENT_FIELDS) {
      if (!precedent.includes(field)) failures.push(`SIMPLE.md precedent ${index + 1} is missing ${field}`);
    }
  }

  if (profile.length > MAX_PROFILE_CHARS) {
    failures.push(`SIMPLE.md exceeds ${MAX_PROFILE_CHARS} characters; move specialist detail beside the code or into focused documentation`);
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

  if (!existsSync(profilePath)) writeFileSync(profilePath, PROFILE);
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
