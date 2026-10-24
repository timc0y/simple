#!/usr/bin/env node

import { lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "skills/simple");
export const SUPPORTED_HOSTS = Object.freeze(["opencode", "claude", "codex", "antigravity"]);

export function skillLinks(home = homedir()) {
  return [
    join(home, ".agents/skills/simple"),
    join(home, ".claude/skills/simple"),
    join(home, ".codex/skills/simple"),
    join(home, ".config/opencode/skills/simple"),
    // These are Antigravity's documented App/IDE and CLI paths, not Gemini CLI support.
    join(home, ".gemini/config/skills/simple"),
    join(home, ".gemini/antigravity-cli/skills/simple")
  ];
}

export function install(home = homedir()) {
  // Preflight every destination before changing any existing installation.
  const links = skillLinks(home).map((link) => {
    let entry;
    try { entry = lstatSync(link); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    if (entry && !entry.isSymbolicLink()) throw new Error(`refusing to replace non-symlink ${link}`);
    return { link, entry };
  });
  for (const { link, entry } of links) {
    if (entry && resolve(dirname(link), readlinkSync(link)) === target) continue;
    mkdirSync(dirname(link), { recursive: true });
    if (entry) rmSync(link);
    symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
    process.stdout.write(`linked ${link} -> ${target}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) install();
