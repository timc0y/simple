#!/usr/bin/env node
// Evidence parsing only. Trace commands are never evaluated or executed.
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const targetRelative = ".agents/skills/simple/SKILL.md";
const invalid = (reason) => ({ status: "invalid", activated: null, reason });

// Deliberately not a shell parser: accept complete, literal, whitespace-separated
// words with simple quotes; reject escapes, substitutions and concatenated quotes.
function literalWords(command) {
  if (typeof command !== "string" || !command.trim()) return null;
  const words = [];
  let offset = 0;
  while (offset < command.length) {
    while (/[ \t]/.test(command[offset] ?? "") && offset < command.length) offset++;
    if (offset === command.length) break;
    const quote = command[offset] === '"' || command[offset] === "'" ? command[offset++] : null;
    const start = offset;
    if (quote) {
      while (offset < command.length && command[offset] !== quote) offset++;
      if (offset === command.length) return null;
      words.push(command.slice(start, offset++));
      if (offset < command.length && !/[ \t]/.test(command[offset])) return null;
    } else {
      while (offset < command.length && !/[ \t]/.test(command[offset])) offset++;
      const word = command.slice(start, offset);
      if (/["']/.test(word)) return null;
      words.push(word);
    }
  }
  return words;
}

function inspectCommand(command, workspace, cwd) {
  let words = literalWords(command);
  if (!words) return "ambiguous";
  // Codex may display the host's literal shell wrapper, not just its inner command.
  if (["bash", "zsh", "sh", "/bin/bash", "/bin/zsh", "/bin/sh"].includes(words[0])) {
    if (words.length !== 3 || !["-c", "-lc"].includes(words[1])) return "ambiguous";
    command = words[2];
    words = literalWords(command);
  }
  if (!words || /[;&|`$<>\\\r\n*?(){}]/.test(command)) return "ambiguous";
  const [tool, ...args] = words;
  if (["echo", "printf", "ls", "test"].includes(tool)) return "non-read";
  if (tool === "cd") return "ambiguous";
  let path;
  if (tool === "cat" && args.length === 1) path = args[0];
  else if (tool === "head" && args.length === 2 && /^-n[1-9]\d*$/.test(args[0])) path = args[1];
  else if (tool === "head" && args.length === 3 && args[0] === "-n" && /^[1-9]\d*$/.test(args[1])) path = args[2];
  else if (tool === "sed" && args.length === 3 && args[0] === "-n" && /^[1-9]\d*(?:,[1-9]\d*)?p$/.test(args[1])) path = args[2];
  else return /SKILL\.md|\.agents\/skills/.test(command) ? "ambiguous" : "non-read";
  if (!path || path.startsWith("-") || path.split(/[\\/]/).includes("..")) return "ambiguous";
  const actualCwd = cwd === undefined ? workspace : cwd;
  if (typeof actualCwd !== "string" || !isAbsolute(actualCwd)) return "ambiguous";
  return resolve(actualCwd, path) === resolve(workspace, targetRelative) ? "target" : "non-read";
}

export function classifyEvidence(input, workspace, solverExit) {
  if (!Number.isInteger(solverExit) || solverExit !== 0) return invalid("solver-failed-or-unrecorded");
  if (typeof workspace !== "string" || !isAbsolute(workspace) || typeof input !== "string" || !input.trim()) return invalid("missing-trace-or-workspace");
  let events;
  try {
    events = input.trim().split(/\r?\n/).map((line) => JSON.parse(line));
    if (events.some((event) => !event || typeof event !== "object" || Array.isArray(event) || typeof event.type !== "string")) throw new Error("shape");
  } catch { return invalid("malformed-trace"); }
  const completions = events.filter((event) => event.type === "turn.completed");
  if (completions.length !== 1 || events.at(-1)?.type !== "turn.completed" ||
      (completions[0].status !== undefined && completions[0].status !== "completed")) return invalid("turn-not-completed");
  if (events.some((event) => ["turn.failed", "error"].includes(event.type))) return invalid("trace-error");
  const finalIndex = events.findLastIndex((event) => event.type === "item.completed" && event.item?.type === "agent_message" &&
    (event.item.phase === undefined || event.item.phase === "final") && typeof event.item.text === "string" && event.item.text.trim());
  const lastCommand = events.findLastIndex((event) => event.item?.type === "command_execution");
  if (finalIndex < 0 || finalIndex < lastCommand) return invalid("final-message-missing");
  const pending = new Set(), completed = new Set();
  let activated = false;
  for (const event of events) {
    const item = event.item;
    if (!item) continue;
    if (item.type === "command_execution") {
      if (typeof item.id !== "string" || !item.id) return invalid("command-identity-missing");
      if (event.type === "item.started") { pending.add(item.id); continue; }
      if (event.type === "item.updated") continue;
      if (!["item.completed", "item.failed"].includes(event.type) || completed.has(item.id)) return invalid("command-terminal-ambiguous");
      completed.add(item.id); pending.delete(item.id);
      const shape = inspectCommand(item.command, workspace, item.cwd ?? item.workdir);
      if (shape === "ambiguous") return invalid("unsupported-or-ambiguous-command");
      if (shape !== "target") continue;
      if (event.type !== "item.completed" || item.exit_code !== 0 ||
          (item.status !== undefined && item.status !== "completed") ||
          typeof item.aggregated_output !== "string" || !item.aggregated_output.trim()) return invalid("skill-read-not-successful");
      activated = true;
    } else if (!["agent_message", "reasoning", "todo_list"].includes(item.type)) {
      // A new native read/MCP/file event needs its own verified host contract.
      return invalid("unsupported-tool-evidence");
    }
  }
  if (pending.size) return invalid("command-not-completed");
  return { status: "valid", activated, reason: activated ? "successful-skill-read" : "no-supported-skill-read" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [path, workspace, exitText] = process.argv.slice(2);
  let result;
  try {
    result = classifyEvidence(readFileSync(path, "utf8"), workspace,
      exitText !== undefined && /^\d+$/.test(exitText) ? Number(exitText) : NaN);
  } catch { result = invalid("trace-unavailable"); }
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
