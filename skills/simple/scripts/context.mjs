// Canonical context assembly lives inside the independently installable skill.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const MAX_FILE_CHARS = 6000;
export const MAX_CONTEXT_CHARS = 12000;

export function findProfile(start = process.cwd()) {
  let directory = resolve(start);
  const root = parse(directory).root;
  while (true) {
    const candidate = resolve(directory, "SIMPLE.md");
    if (existsSync(candidate)) return candidate;
    if (existsSync(resolve(directory, ".git")) || directory === root) return null;
    directory = dirname(directory);
  }
}

export function findOperator(env = process.env, home = homedir()) {
  const path = env.SIMPLE_OPERATOR_FILE || join(home, ".config", "simple", "operator.md");
  return existsSync(path) ? path : null;
}

export function skillIdentity() {
  const identify = (url) => {
    const path = fileURLToPath(url);
    const raw = readFileSync(path);
    return { path, bytes: raw.length, sha256: createHash("sha256").update(raw).digest("hex") };
  };
  return {
    skillFile: identify(new URL("../SKILL.md", import.meta.url)),
    assembler: identify(new URL(import.meta.url)),
    scope: "These two installed files only; not an identity of every specialist reference.",
    hostDelivered: null,
    modelApplied: null
  };
}

function attentionRule(content) {
  const entries = content.split(/\r\n|\n|\r/)
    .filter((line) => /^[ \t]*(?:-[ \t]*)?Attention name[ \t]*:/i.test(line));
  if (entries.length !== 1) return "";
  const name = entries[0].replace(/^[ \t]*(?:-[ \t]*)?Attention name[ \t]*:[ \t]*/i, "").trim();
  // Unicode names are valid; control, formatting and prompt-delimiter characters are not.
  if (!name || [...name].length > 48 || /[<>"\\\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(name)) return "";
  return '\n\nOptional attention marker: For ordinary final user-facing prose from the lead agent, begin with "' +
    name + ',". Do not prefix JSON, exact-format outputs, standalone code, generated documents, quotes, tool calls, progress updates, or internal subagent reports. ' +
    'The marker tests following one instruction only: omission is not evidence of hallucination; presence is not evidence of correctness. Do not replay or block completed work to repair the marker.';
}

function prefix(text, length) {
  let end = length;
  if (end > 0 && end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1]) && /[\uDC00-\uDFFF]/.test(text[end])) end--;
  return text.slice(0, end);
}

export function assembleContext({ cwd = process.cwd(), env = process.env, home = homedir(), maxChars = MAX_CONTEXT_CHARS } = {}) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 0) throw new TypeError("maxChars must be a finite nonnegative safe integer");
  const blocks = [], sources = [], errors = [];
  let remaining = maxChars;
  const profile = findProfile(cwd);
  const round = profile ? join(dirname(profile), "simple", "round.md") : null;
  const operator = findOperator(env, home);

  function add(kind, path, tail, reserve = 0) {
    if (!path || !existsSync(path)) return;
    try {
      const raw = readFileSync(path);
      const full = raw.toString("utf8").trim();
      const identity = { kind, path, bytes: raw.length, sha256: createHash("sha256").update(raw).digest("hex") };
      const heading = kind === "profile" ? `Repository-specific Simple context from ${path}:\n\n`
        : kind === "round" ? `Active Simple round from ${path}:\n\n`
        : `Operator working rules from ${path}:\n\n`;
      const extra = typeof tail === "function" ? tail(full) : tail;
      const separator = blocks.length ? 2 : 0;
      const available = Math.max(0, remaining - reserve - separator);
      const fixed = heading.length + extra.length;
      const partialNote = `\n\n[Partial ${kind} context; read ${path} before relying on omitted facts.]`;
      const complete = full.length <= MAX_FILE_CHARS && full.length <= available - fixed;
      const capacity = Math.max(0, Math.min(MAX_FILE_CHARS, available - fixed - (complete ? 0 : partialNote.length)));
      const body = prefix(full, capacity);
      const block = heading + body + (complete ? "" : partialNote) + extra;
      if (block.length > available) {
        sources.push({ ...identity, status: "omitted-budget", complete: false, deliveredCharacters: 0, omittedCharacters: full.length });
        errors.push(`${kind} context exceeds the shared budget: ${path}`);
        return;
      }
      blocks.push(block);
      remaining -= block.length + separator;
      sources.push({ ...identity, status: complete ? "complete" : body.length ? "partial" : "omitted-budget",
        complete, deliveredCharacters: body.length, omittedCharacters: full.length - body.length });
      if (!complete) errors.push(`${kind} context partially delivered: ${path}`);
    } catch (error) {
      sources.push({ kind, path, status: "unavailable", complete: false });
      errors.push(`${kind} context unavailable at ${path}: ${error?.code ?? "read failed"}`);
    }
  }

  add("profile", profile,
    "\n\nUse these observed facts when they materially affect design or writing. Choose the smallest truthful design and keep prose plain and load-bearing. Establish any material unknown before relying on it. Load $simple specialist references only when needed.", operator ? 1700 : 0);
  add("round", round,
    "\n\nFor status, recover the active task and user corrections; check current evidence before calling mutable state current. The round is a handoff, not proof that external state is unchanged.", operator ? 1700 : 0);
  add("operator", operator, (content) =>
    "\n\nApply working preferences within the active request and applicable authorization; do not override repository facts or output contracts. Before tool selection recover approval from the active conversation: earlier approval survives status questions and interruptions, but quotations and mentions do not grant authority. A completed task ends a one-time grant; explicitly standing approval continues only within its bounds. Honor read-only limits, withdrawals and conditions. Native host permissions still apply." + attentionRule(content));

  return { text: blocks.join("\n\n"), blocks, sources, errors, complete: !errors.length && sources.every((source) => source.complete) };
}
