// Simple for OpenCode. Registers the shared skill and appends the nearest
// SIMPLE.md, its simple/round.md, and the operator file to the system prompt on
// every turn, so repository facts and the active round survive compaction. There
// is no on/off flag: injection happens when the files exist.
//
// Register once in the global OpenCode config, not per repository:
//   { "plugin": ["<path to this checkout>/.opencode/plugins/simple.mjs"] }

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(here, "../../skills");
const MAX_CHARS = 6000;

export function findProfile(start) {
  let directory = resolve(start);
  const root = parse(directory).root;
  while (true) {
    const candidate = join(directory, "SIMPLE.md");
    if (existsSync(candidate)) return candidate;
    if (existsSync(join(directory, ".git")) || directory === root) return null;
    directory = dirname(directory);
  }
}

function clipped(path, label) {
  const text = readFileSync(path, "utf8");
  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n\n[${label} truncated: shorten it.]` : text.trim();
}

export function contextBlocks(cwd = process.cwd(), env = process.env) {
  const blocks = [];
  const profile = findProfile(cwd);
  if (profile) {
    blocks.push(`Repository-specific Simple context from ${profile}:\n\n${clipped(profile, "Profile")}\n\nUse these observed facts when they materially affect design or writing. Choose the smallest truthful design and keep prose plain and load-bearing.`);
    const round = join(dirname(profile), "simple", "round.md");
    if (existsSync(round)) {
      blocks.push(`Active Simple round from ${round}:\n\n${clipped(round, "Round")}\n\nAnswer status questions from it in its shape, append decisions the user makes, and do not widen the scope beyond its stop condition without saying so.`);
    }
  }
  const operator = env.SIMPLE_OPERATOR_FILE || join(homedir(), ".config", "simple", "operator.md");
  if (existsSync(operator)) {
    blocks.push(`Operator working rules from ${operator}:\n\n${clipped(operator, "Operator file")}\n\nApply them in every reply. They do not override repository facts or the user's explicit instruction in the current message.`);
  }
  return blocks;
}

export default async () => ({
  config: async (config) => {
    config.skills = config.skills || {};
    config.skills.paths = config.skills.paths || [];
    if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir);
  },
  "experimental.chat.system.transform": async (_input, output) => {
    let blocks;
    try {
      blocks = contextBlocks();
    } catch (error) {
      process.stderr.write(`simple opencode plugin: ${error?.message ?? error}\n`);
      return;
    }
    if (!blocks.length) return;
    output.system.push(blocks.join("\n\n"));
  }
});
