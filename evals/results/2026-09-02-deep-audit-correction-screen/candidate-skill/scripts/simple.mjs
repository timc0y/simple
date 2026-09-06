#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const MAX_PROFILE_CHARS = 6000;

const LEGACY_ROUTES = [
  "Before a change where repository facts could change the implementation, invoke `$simple` and read the nearest `SIMPLE.md`. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `plan`, `review`, or `check` for an explicit Simple workflow.",
  "Invoke `$simple` and read the nearest `SIMPLE.md` before decisions repository facts could change: architecture, ownership, compatibility, migration, deletion, or broad refactoring. Use Simple writing mode for plans, documentation, comments, and handoffs that should be concise, plain, and load-bearing. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `plan`, `review`, `write`, `emulate`, or `check` for an explicit Simple workflow.",
  "Invoke `$simple` and read the nearest `SIMPLE.md` before decisions repository facts could change: architecture, ownership, compatibility, migration, deletion, or broad refactoring. Use Simple writing mode for plans, documentation, comments, and handoffs that should be concise, plain, and load-bearing. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `board`, `plan`, `review`, `write`, `emulate`, or `check` for an explicit Simple workflow.",
  "Invoke `$simple` and read the nearest `SIMPLE.md` before decisions repository facts could change: architecture, ownership, compatibility, migration, deletion, or broad refactoring. Use Simple writing mode for plans, documentation, comments, and handoffs that should be concise, plain, and load-bearing. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `board`, `work`, `reconcile`, `plan`, `review`, `write`, `emulate`, or `check` for an explicit Simple workflow."
];
const ROUTE = "Use `$simple` and read the nearest `SIMPLE.md` for repository-dependent decisions and work. Explicit workflows: `simple init`, `audit`, `board`, `work`, `reconcile`, `plan`, `review`, `write`, `emulate`, or `check`.";
const PROFILE_TEMPLATE_PATH = new URL("../assets/SIMPLE.template.md", import.meta.url);
const PROFILE = readFileSync(PROFILE_TEMPLATE_PATH, "utf8");
const REQUIRED_HEADINGS = [...PROFILE.matchAll(/^## .+$/gm)].map(([heading]) => heading);

export function check(root = process.cwd()) {
  const failures = [];
  const target = resolve(root);
  const repository = repositoryRoot(target);
  const agentsPath = resolve(repository, "AGENTS.md");
  const claudePath = resolve(repository, "CLAUDE.md");
  const profilePath = nearestProfile(target, repository);
  const agents = read(agentsPath, failures);
  const claude = read(claudePath, failures);
  const profile = read(profilePath, failures);

  if (agents && !agents.includes(ROUTE)) {
    failures.push("AGENTS.md must route repository-dependent decisions to $simple and SIMPLE.md");
  }
  if ((agents.match(/^## Simple\s*$/gm) ?? []).length > 1) {
    failures.push("AGENTS.md contains duplicate ## Simple sections; reconcile them before continuing");
  }
  if (claude && !/^@AGENTS\.md\s*$/m.test(claude) && !claude.includes(ROUTE)) {
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
  let agents = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : "";

  const legacyRoute = LEGACY_ROUTES.find((route) => agents.includes(route));
  if (legacyRoute) {
    agents = agents.replace(legacyRoute, ROUTE);
    writeFileSync(agentsPath, agents);
  } else if (!agents.includes(ROUTE)) {
    if (/^## Simple\s*$/m.test(agents)) {
      throw new Error("AGENTS.md has an unrecognized ## Simple section; reconcile it manually instead of adding a duplicate");
    }
    writeFileSync(agentsPath, `${agents.trimEnd()}${agents.trim() ? "\n\n" : ""}## Simple\n\n${ROUTE}\n`);
  }

  const claude = existsSync(claudePath) ? readFileSync(claudePath, "utf8") : "";
  if (!/^@AGENTS\.md\s*$/m.test(claude) && !claude.includes(ROUTE)) {
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

function repositoryRoot(start) {
  let directory = start;
  while (true) {
    if (existsSync(resolve(directory, ".git"))) return directory;
    const parent = dirname(directory);
    if (parent === directory) return start;
    directory = parent;
  }
}

function nearestProfile(start, repository) {
  let directory = start;
  while (true) {
    const candidate = resolve(directory, "SIMPLE.md");
    if (existsSync(candidate)) return candidate;
    if (directory === repository) return candidate;
    const parent = dirname(directory);
    if (parent === directory) return resolve(repository, "SIMPLE.md");
    directory = parent;
  }
}

function print(failures, failProcess = true) {
  process.stdout.write(`${JSON.stringify({ ok: failures.length === 0, ready: failures.length === 0, failures }, null, 2)}\n`);
  if (failProcess && failures.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command = "check", directory = process.cwd()] = process.argv.slice(2);
  if (command === "init" || command === "setup") {
    try {
      init(resolve(directory));
      print(check(resolve(directory)), false);
    } catch (error) {
      process.stderr.write(`simple init: ${error.message}\n`);
      process.exitCode = 1;
    }
  } else if (command === "check") {
    print(check(resolve(directory)));
  } else {
    process.stderr.write("Usage: simple.mjs <init|check> [repository]\n");
    process.exitCode = 2;
  }
}
