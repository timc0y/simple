#!/usr/bin/env node

import { lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "skills/simple");

export function skillLinks(home = homedir()) {
  return [
    join(home, ".agents/skills/simple"),
    join(home, ".claude/skills/simple"),
    join(home, ".codex/skills/simple"),
    join(home, ".config/opencode/skills/simple"),
    join(home, ".gemini/config/skills/simple")
  ];
}

export function install(home = homedir()) {
  for (const link of skillLinks(home)) {
    mkdirSync(dirname(link), { recursive: true });
    let entry;
    try {
      entry = lstatSync(link);
    } catch {
      entry = null;
    }
    if (entry?.isSymbolicLink() && resolve(dirname(link), readlinkSync(link)) === target) continue;
    if (entry && !entry.isSymbolicLink()) throw new Error(`refusing to replace non-symlink ${link}`);
    if (entry) rmSync(link);
    symlinkSync(target, link);
    process.stdout.write(`linked ${link} -> ${target}\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) install();
