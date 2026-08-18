#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "skills/simple");
const links = [
  join(homedir(), ".claude/skills/simple"),
  join(homedir(), ".codex/skills/simple")
];

for (const link of links) {
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
