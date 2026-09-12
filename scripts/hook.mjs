#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { MAX_PROFILE_CHARS, roundPathFor } from "../skills/simple/scripts/simple.mjs";

export const RECONCILIATION_REASON = "This turn edited repository files. Before finishing, update each existing truth owner made false by the final diff. Remove completed instructions from the ordered queue. Delete fulfilled temporary plans, reviews, audits, status notes, and handoffs after their evidence has moved to the durable owner; Git preserves their history. Preserve decisions, contracts, retained evidence, recovery paths, and unknown obligations. Leave unrelated documents and user changes alone. If the final diff already satisfies this, make no further edits and do not repeat checks that already passed against it.";

const markerRoot = join(tmpdir(), "simple-reconciliation");
const NEGATION_LEAD = /^(?:no\b|nope\b|not\b|never\b|stop\b|don['’]?t\b|do not\b|wait\b|hold\b)/i;
const NEGATION_WORD = /\b(?:don['’]?t|do not|never|not|stop|without|no|skip|hold off on)\b/i;
const AFFIRMATIVE_LEAD = /^(?:yes|yep|yeah|y|ok|okay|go|go ahead|do it|do this|do this all|do that|do all|do the lot|do both|do everything|proceed|approved|confirmed|agreed|fine|sure|ship it|push it|push|release|run it|run them|go for it|continue|carry on)\b/i;
const source = await readInput();
const payload = parseJson(source);
const event = payload.hook_event_name ?? payload.hookEventName;
const cwd = resolve(payload.cwd ?? process.cwd());
const profilePath = findProfile(cwd);

let operatorPath = null;
try {
  operatorPath = findOperator();

  if (!profilePath && event === "Stop") {
    writeJson({});
  } else if (event === "SessionStart" || event === "SubagentStart") {
    const context = [
      profilePath ? profileContext(profilePath) : "",
      profilePath ? roundContext(profilePath) : "",
      operatorPath ? operatorContext(operatorPath) : ""
    ].filter(Boolean).join("\n\n");
    if (context) writeContext(event, context);
  } else if (event === "PreToolUse" && isShellTool(payload.tool_name ?? payload.toolName ?? "")) {
    const decision = guardDecision(payload, operatorPath);
    if (decision) writeJson(decision);
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
  return `Operator working rules from ${path}:\n\n${body}\n\nThese describe how this person works and reads. Apply them in every reply. They do not override repository facts or the user's explicit instruction in the current message.`;
}

export function guardPatterns(operatorPath) {
  if (!operatorPath) return [];
  const text = readFileSync(operatorPath, "utf8");
  const section = text.split(/^## /m).find((part) => /^Guard\b/i.test(part));
  if (!section) return [];
  return section.split("\n").slice(1)
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [patternText, allowText] = line.split("->").map((part) => part.trim());
      const tool = patternText.startsWith("tool:");
      const source = tool ? patternText.slice(5).trim() : patternText;
      const allowWords = (allowText ? allowText.split(/\s*,\s*/) : [source.split(/\s+/).filter((word) => /^[a-z]{3,}$/i.test(word)).pop() || source]).filter(Boolean);
      return { tool, pattern: new RegExp(source, "i"), allow: new RegExp(`\\b(?:${allowWords.map(escapeRegExp).join("|")})`, "i"), source };
    });
}

export function guardDecision(payload, operatorPath) {
  const patterns = guardPatterns(operatorPath);
  if (!patterns.length) return null;
  const toolName = payload.tool_name ?? payload.toolName ?? "";
  const command = inputText(payload.tool_input ?? payload.toolInput ?? {});
  const hits = patterns.filter((entry) => (entry.tool ? entry.pattern.test(toolName) : entry.pattern.test(command)));
  if (!hits.length) return null;
  const hit = hits[0];
  const turn = lastTurn(payload.transcript_path ?? payload.transcriptPath, profilePath ? roundPathFor(profilePath) : null);
  if (turn.user === null) {
    return { hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: `Guarded action (${hit.source}). Run it only if the user's current message asked for it explicitly; otherwise stop and ask.` } };
  }
  if (hits.every((entry) => authorises(turn, entry))) return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: `Guarded action (${hits.filter((entry) => !authorises(turn, entry)).map((entry) => entry.source).join("; ")}) and the user's current message does not ask for it. Report what you would run and wait for an explicit instruction in this turn.`
    }
  };
}


export function authorises(turn, hit) {
  const user = (turn.user ?? "").trim();
  if (NEGATION_LEAD.test(user)) return false;
  if (negatedNear(user, hit.allow)) return false;
  if (hit.allow.test(user)) return true;
  const proposals = [turn.assistant, turn.round].filter(Boolean).join("\n");
  const proposed = proposals ? (hit.pattern.test(proposals) || hit.allow.test(proposals)) : false;
  return proposed && AFFIRMATIVE_LEAD.test(user);
}

function negatedNear(user, allow) {
  const words = user.split(/\s+/);
  for (let index = 0; index < words.length; index += 1) {
    if (!allow.test(words[index])) continue;
    const before = words.slice(Math.max(0, index - 4), index).join(" ");
    if (NEGATION_WORD.test(before)) return true;
  }
  return false;
}

export function lastTurn(transcriptPath, roundPath = null) {
  const round = roundPath && existsSync(roundPath) ? readFileSync(roundPath, "utf8") : null;
  if (!transcriptPath || !existsSync(transcriptPath)) return { user: null, assistant: null, round };
  const lines = readFileSync(transcriptPath, "utf8").split("\n");
  let user = null; let assistant = null;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (!line) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const content = entry.message?.content;
    const text = typeof content === "string" ? content : Array.isArray(content) ? content.filter((block) => block.type === "text").map((block) => block.text).join("\n") : "";
    const trimmed = text.trim();
    if (entry.type === "user" && !entry.isMeta && user === null) {
      if (!trimmed || /^(?:<|\[Request interrupted|Stop hook feedback|Base directory for this skill)/.test(trimmed)) continue;
      user = trimmed; continue;
    }
    if (entry.type === "assistant" && user !== null && trimmed) { assistant = trimmed; break; }
  }
  return { user, assistant, round };
}

export function lastUserMessage(transcriptPath) {
  if (!transcriptPath || !existsSync(transcriptPath)) return null;
  const lines = readFileSync(transcriptPath, "utf8").split("\n");
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (!line) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (entry.type !== "user" || entry.isMeta) continue;
    const content = entry.message?.content;
    const text = typeof content === "string" ? content : Array.isArray(content) ? content.filter((block) => block.type === "text").map((block) => block.text).join("\n") : "";
    const trimmed = text.trim();
    if (!trimmed || /^(?:<|\[Request interrupted|Stop hook feedback|Base directory for this skill)/.test(trimmed)) continue;
    return trimmed;
  }
  return null;
}

function isShellTool(toolName) {
  return /^(?:Bash|shell|exec_command|local_shell|container\.exec|mcp__.*)$/i.test(toolName);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
