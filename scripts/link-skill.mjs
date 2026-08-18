#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "skills/simple");

export function skillLinks(home = homedir()) {
  return [
    join(home, ".claude/skills/simple"),
    join(home, ".codex/skills/simple"),
    join(home, ".config/opencode/skills/simple"),
    join(home, ".gemini/config/skills/simple")
  ];
}

export function install(home = homedir()) {
  for (const link of skillLinks(home)) {
    mkdirSync(dirname(link), { recursive: true });
    let current;
    try {
      current = lstatSync(link).isSymbolicLink() ? resolve(dirname(link), readlinkSync(link)) : null;
    } catch {
      current = undefined;
    }
    if (current === target) continue;
    if (current === null || existsSync(link) || current !== undefined) rmSync(link, { recursive: true, force: true });
    symlinkSync(target, link);
    process.stdout.write(`linked ${link} -> ${target}\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) install();
