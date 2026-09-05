#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { MAX_PROFILE_CHARS } from "../skills/simple/scripts/simple.mjs";

export const RECONCILIATION_REASON = "This turn edited repository files. Before finishing, update each existing truth owner made false by the final diff. Remove completed instructions from the ordered queue. Delete fulfilled temporary plans, reviews, audits, status notes, and handoffs after their evidence has moved to the durable owner; Git preserves their history. Preserve decisions, contracts, retained evidence, recovery paths, and unknown obligations. Leave unrelated documents and user changes alone. If the final diff already satisfies this, make no further edits and do not repeat checks that already passed against it.";

const markerRoot = join(tmpdir(), "simple-reconciliation");
const source = await readInput();
const payload = parseJson(source);
const event = payload.hook_event_name ?? payload.hookEventName;
const cwd = resolve(payload.cwd ?? process.cwd());
const profilePath = findProfile(cwd);

if (!profilePath && event === "Stop") {
  writeJson({});
} else if (profilePath && (event === "SessionStart" || event === "SubagentStart")) {
  writeContext(event, profileContext(profilePath));
} else if (profilePath && event === "PreToolUse") {
  const reminder = writingReminder(
    payload.tool_input ?? payload.toolInput ?? {},
    payload.tool_name ?? payload.toolName ?? ""
  );
  if (reminder) writeContext(event, reminder);
} else if (profilePath && event === "PostToolUse") {
  markReconciliation(payload, profilePath);
} else if (profilePath && event === "Stop") {
  writeJson(reconciliationDecision(payload, profilePath));
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

export function writingReminder(input, toolName = "") {
  const text = inputText(input);
  const reminders = [];

  if (/\.(?:md|mdx)(?:\b|["'])/i.test(text)) {
    reminders.push("Review the Markdown edit after it runs. Keep decisions, contracts, constraints, proof, and operational knowledge; use few sentence-case headings, shallow lists, restrained emphasis, and no decorative styling.");
  }

  if (hasAddedComment(input, toolName)) {
    reminders.push("Review each added comment after the edit runs. Keep only non-obvious reasons, contracts, invariants, traps, and reconsideration conditions. Let the code show the operation.");
  }

  return reminders.join("\n");
}

export function reconciliationDecision(payload, profilePath) {
  const marker = reconciliationMarker(payload, profilePath);
  if (!marker || !existsSync(marker)) return {};

  rmSync(marker, { force: true });
  if (payload.stop_hook_active ?? payload.stopHookActive) return {};
  return { decision: "block", reason: RECONCILIATION_REASON };
}

export function markReconciliation(payload, profilePath) {
  const toolName = payload.tool_name ?? payload.toolName ?? "";
  if (!/^(?:apply_patch|Edit|Write)$/i.test(toolName)) return;

  const marker = reconciliationMarker(payload, profilePath);
  if (!marker) return;
  mkdirSync(markerRoot, { recursive: true, mode: 0o700 });
  writeFileSync(marker, "", { mode: 0o600 });
}

function reconciliationMarker(payload, profilePath) {
  const sessionId = payload.session_id ?? payload.sessionId;
  if (!sessionId || !profilePath) return null;
  const key = createHash("sha256").update(`${sessionId}\0${profilePath}`).digest("hex");
  return join(markerRoot, key);
}

function hasAddedComment(input, toolName) {
  if (/apply_patch$/i.test(toolName)) {
    return /(?:^|\n)\+(?!\+\+)\s*(?:\/\/|\/\*|<!--)/m.test(inputText(input));
  }
  if (/edit$/i.test(toolName)) {
    return /(?:^|\n)\s*(?:\/\/|\/\*|<!--)/m.test(inputText(input.new_string ?? input.newString ?? ""));
  }
  if (/write$/i.test(toolName)) {
    return /(?:^|\n)\s*(?:\/\/|\/\*|<!--)/m.test(inputText(input.content ?? ""));
  }
  return /(?:^|\n)\s*(?:\/\/|\/\*|<!--)/m.test(inputText(input));
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
  writeJson({
    hookSpecificOutput: { hookEventName: eventName, additionalContext }
  });
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}
