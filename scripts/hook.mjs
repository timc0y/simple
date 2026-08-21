#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, parse, resolve } from "node:path";
import { MAX_PROFILE_CHARS } from "../skills/simple/scripts/simple.mjs";

const source = await readInput();
const payload = parseJson(source);
const event = payload.hook_event_name ?? payload.hookEventName;
const cwd = resolve(payload.cwd ?? process.cwd());
const profilePath = findProfile(cwd);

if (!profilePath) process.exit(0);

if (event === "SessionStart" || event === "SubagentStart") {
  writeContext(event, profileContext(profilePath));
}

if (event === "PreToolUse") {
  const reminder = writingReminder(payload.tool_input ?? payload.toolInput ?? {});
  if (reminder) writeContext(event, reminder);
}

export function findProfile(start) {
  let directory = resolve(start);
  const root = parse(directory).root;

  while (true) {
    const candidate = resolve(directory, "SIMPLE.md");
    if (existsSync(candidate)) return candidate;
    if (existsSync(resolve(directory, ".git")) || directory === root) return null;
    directory = dirname(directory);
  }
}

export function profileContext(path) {
  const profile = readFileSync(path, "utf8");
  const truncated = profile.length > MAX_PROFILE_CHARS;
  const body = truncated ? `${profile.slice(0, MAX_PROFILE_CHARS)}\n\n[Profile truncated: shorten SIMPLE.md.]` : profile.trim();
  return `Repository-specific Simple context from ${path}:\n\n${body}\n\nUse these observed facts when they materially affect design or writing. Choose the smallest truthful design and keep prose plain and load-bearing. Establish any material unknown before relying on it. Load $simple specialist references only when the task needs them.`;
}

export function writingReminder(input) {
  const text = inputText(input);
  const reminders = [];

  if (/\.(?:md|mdx)(?:\b|["'])/i.test(text)) {
    reminders.push("Keep Markdown load-bearing and plain. Preserve decisions, contracts, constraints, proof, and operational knowledge; use few sentence-case headings, shallow lists, restrained emphasis, and no decorative styling.");
  }

  if (hasAddedComment(text)) {
    reminders.push("Use comments for concise non-obvious reasons, contracts, invariants, traps, and reconsideration conditions. Let the code show the operation.");
  }

  return reminders.join("\n");
}

function hasAddedComment(text) {
  return /(?:^|\n)\s*\+?\s*(?:\/\/|\/\*|<!--)/m.test(text);
}

function inputText(input) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) return input.map(inputText).join("\n");
  if (input && typeof input === "object") return Object.values(input).map(inputText).join("\n");
  return "";
}

async function readInput() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input;
}

function parseJson(input) {
  try {
    return input.trim() ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

function writeContext(eventName, additionalContext) {
  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: { hookEventName: eventName, additionalContext }
  })}\n`);
}
