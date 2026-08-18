#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, parse, resolve } from "node:path";
import { check, MAX_PROFILE_CHARS } from "../skills/simple/scripts/simple.mjs";

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

if (event === "Stop") {
  const failures = check(dirname(profilePath));
  if (failures.length) writeFailure(`Simple profile check failed: ${failures.join("; ")}`, event);
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
  return `Repository-specific Simple context from ${path}:\n\n${body}\n\nApply these observed facts before adding compatibility, migrations, infrastructure, state, or parallel workflows. Unknown facts are not permission. Load $simple specialist references only when the task needs them.`;
}

export function writingReminder(input) {
  const text = inputText(input);
  const reminders = [];

  if (/\.(?:md|mdx)(?:\b|["'])/i.test(text)) {
    reminders.push("Keep Markdown load-bearing: preserve decisions, contracts, invariants, exact constraints, proof, and necessary operational knowledge. Correct the source of truth instead of adding parallel explanation.");
  }

  if (hasAddedComment(text)) {
    reminders.push("Comments explain non-obvious reasons, contracts, invariants, traps, or reconsideration conditions—not visible syntax.");
  }

  if (/\b(?:backwards?[- ]compat|compatibility layer|dual[- ]write|migration framework|event bus|message queue|new service|versioned API)\b/i.test(text)) {
    reminders.push("This edit may add structural complexity. Check SIMPLE.md for a present obligation and prefer the repository's ordinary path when none exists.");
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

function writeFailure(reason, eventName) {
  const output = process.env.CLAUDE_PROJECT_DIR && !process.env.PLUGIN_ROOT
    ? { decision: "block", reason }
    : {
        hookSpecificOutput: { hookEventName: eventName, additionalContext: reason },
        systemMessage: reason
      };
  process.stdout.write(`${JSON.stringify(output)}\n`);
}
