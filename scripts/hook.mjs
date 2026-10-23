#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { MAX_PROFILE_CHARS, roundPathFor } from "../skills/simple/scripts/simple.mjs";
import { assembleContext } from "./context.mjs";

export const RECONCILIATION_REMINDER = "Before your final response, update each existing truth owner made false by the final diff. Remove completed instructions from the ordered queue. Delete fulfilled temporary plans, reviews, audits, status notes, and handoffs after their evidence has moved to the durable owner; Git preserves their history. Preserve decisions, contracts, retained evidence, recovery paths, and unknown obligations. Leave unrelated documents and user changes alone. If the final diff already satisfies this, make no further edits and do not repeat checks that already passed against it. Treat this as an internal check, then answer the user's request with its outcome, verification and remaining limits.";

export const AUTHORIZATION_GUIDANCE = "Before selecting tools, use authorization from the active conversation for the agreed actions, work and destination. Earlier approval survives status questions, corrections and interruptions. Clear action requests, including requests phrased as questions, and natural approval of a concrete proposal count. Readiness or explanation questions, quotations, review requests and action mentions do not grant permission. Honor withdrawals, read-only limits and unmet conditions. Completed work ends a one-time approval; an explicitly standing instruction remains valid within its stated bounds. Ask only when applicable approval is missing or unclear, or the action or destination exceeds it. Never require a particular word in the latest message or ask again for approval that still applies. Configured action patterns are guidance, not permission decisions; host permissions still apply.";
const source = await readInput();
const payload = parseJson(source);
const event = payload.hook_event_name ?? payload.hookEventName;
const cwd = resolve(payload.cwd ?? process.cwd());
const profilePath = findProfile(cwd);

let operatorPath = null;
try {
  operatorPath = findOperator();

  if (event === "SessionStart" || event === "SubagentStart") {
    const assembled = assembleContext({ cwd, env: process.env });
    for (const failure of assembled.errors) process.stderr.write(`simple hook: ${failure}\n`);
    if (assembled.text) writeContext(event, assembled.text);
  } else if (event === "PreToolUse" && isShellTool(payload.tool_name ?? payload.toolName ?? "")) {
    const reminder = authorizationReminder(payload, operatorPath);
    if (reminder) writeContext(event, reminder);
  } else if (profilePath && event === "PreToolUse") {
    const reminder = writingReminder(
      payload.tool_input ?? payload.toolInput ?? {},
      payload.tool_name ?? payload.toolName ?? ""
    );
    if (reminder) writeContext(event, reminder);
  } else if (profilePath && event === "PostToolUse") {
    if (/^(?:apply_patch|Edit|Write)$/i.test(payload.tool_name ?? payload.toolName ?? "")) {
      writeContext(event, RECONCILIATION_REMINDER);
    }
  }
} catch (error) {
  process.stderr.write(`simple hook: ${error?.message ?? error}\n`);
  writeJson({});
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

export function roundContext(profilePath) {
  const path = roundPathFor(profilePath);
  if (!existsSync(path)) return "";
  const round = readFileSync(path, "utf8");
  const body = round.length > MAX_PROFILE_CHARS ? `${round.slice(0, MAX_PROFILE_CHARS)}\n\n[Round truncated: close finished items into their owners.]` : round.trim();
  return `Active Simple round from ${path}:\n\n${body}\n\nAnswer status questions from it in its shape, append decisions the user makes, and do not widen the scope beyond its stop condition without saying so. Temporary plans, audits, and handoffs for this repository live beside it in the same folder and are deleted when fulfilled.`;
}

export function findOperator() {
  const candidate = process.env.SIMPLE_OPERATOR_FILE || join(homedir(), ".config", "simple", "operator.md");
  return existsSync(candidate) ? candidate : null;
}

export function operatorContext(path) {
  const text = readFileSync(path, "utf8");
  const body = text.length > MAX_PROFILE_CHARS ? `${text.slice(0, MAX_PROFILE_CHARS)}\n\n[Operator file truncated: shorten it.]` : text.trim();
  return `Operator working rules from ${path}:\n\n${body}\n\nThese describe how this person works and reads. Apply them in every reply. They do not override repository facts or the user's applicable authorization.\n\n${AUTHORIZATION_GUIDANCE}`;
}

export function guardPatterns(operatorPath) {
  if (!operatorPath) return [];
  const text = readFileSync(operatorPath, "utf8");
  const section = text.split(/^## /m).find((part) => /^Guard\b/i.test(part));
  if (!section) return [];
  return section.split("\n").slice(1)
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const patternText = line.split("->")[0].trim();
      const tool = patternText.startsWith("tool:");
      const source = tool ? patternText.slice(5).trim() : patternText;
      return { tool, pattern: new RegExp(source, "i"), source };
    });
}

export function authorizationReminder(payload, operatorPath) {
  const patterns = guardPatterns(operatorPath);
  if (!patterns.length) return "";
  const toolName = payload.tool_name ?? payload.toolName ?? "";
  const command = inputText(payload.tool_input ?? payload.toolInput ?? {});
  const hits = patterns.filter((entry) => (entry.tool ? entry.pattern.test(toolName) : entry.pattern.test(command)));
  if (!hits.length) return "";
  return `Tool input mentions configured action patterns (${hits.map((entry) => entry.source).join("; ")}). A match may be quoted text or a read-only operation; it does not establish an action or its approval. ${AUTHORIZATION_GUIDANCE}`;
}

function isShellTool(toolName) {
  return /^(?:Bash|shell|exec_command|local_shell|container\.exec|mcp__.*)$/i.test(toolName);
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
