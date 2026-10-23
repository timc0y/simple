// One context assembler for session hooks and OpenCode. Fail each optional source
// independently and report exactly what was delivered, without pretending that
// emission proves model use.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";

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

function attentionRule(content) {
  const match = content.match(/^\s*(?:-\s*)?Attention name:\s*([^\r\n]*)$/mi);
  const name = match?.[1]?.trim() ?? "";
  if (!name || name.length > 48 || /[<>\x00-\x1f]/.test(name)) return "";
  return '\n\nOptional attention marker: For ordinary final user-facing prose from the lead agent, begin with "' +
    name.replace(/["\\]/g, "") +
    ',". Do not prefix JSON, exact-format outputs, standalone code, generated documents, quotes, tool calls, progress updates, or internal subagent reports. The marker tests following one instruction only: omission is not evidence of hallucination; presence is not evidence of correctness. Do not replay or block completed work to repair the marker.';
}

export function assembleContext({ cwd = process.cwd(), env = process.env, home = homedir(), maxChars = MAX_CONTEXT_CHARS } = {}) {
  const blocks = [];
  const sources = [];
  const errors = [];
  let remaining = Math.max(0, maxChars);
  const profile = findProfile(cwd);
  const round = profile ? join(dirname(profile), "simple", "round.md") : null;
  const operator = findOperator(env, home);

  function add(kind, path, maximum, tail, reserve = 0) {
    if (!path || !existsSync(path)) return;
    try {
      const full = readFileSync(path, "utf8").trim();
      const heading = kind === "profile" ? `Repository-specific Simple context from ${path}:\n\n`
        : kind === "round" ? `Active Simple round from ${path}:\n\n`
        : `Operator working rules from ${path}:\n\n`;
      const extra = typeof tail === "function" ? tail(full) : tail;
      const separator = blocks.length ? 2 : 0;
      const capacity = Math.max(0, Math.min(maximum, remaining - reserve - heading.length - extra.length - separator - 160));
      const complete = full.length <= capacity;
      const note = complete ? "" : `\n\n[Partial ${kind} context; read ${path} before relying on omitted facts.]`;
      const body = full.slice(0, capacity);
      const block = heading + body + note + extra;
      if (!capacity || block.length + separator > remaining - reserve) {
        sources.push({kind, path, status: "omitted-budget", complete: false, bytes: Buffer.byteLength(full), sha256: createHash("sha256").update(full).digest("hex")});
        errors.push(`${kind} context exceeds the shared budget: ${path}`);
        return;
      }
      blocks.push(block);
      remaining -= block.length + separator;
      sources.push({kind, path, status: complete ? "complete" : "partial", complete, bytes: Buffer.byteLength(full), deliveredCharacters: body.length, sha256: createHash("sha256").update(full).digest("hex")});
    } catch (error) {
      sources.push({kind, path, status: "unavailable", complete: false});
      errors.push(`${kind} context unavailable at ${path}: ${error?.code ?? error?.message ?? error}`);
    }
  }

  add("profile", profile, MAX_FILE_CHARS,
      "\n\nUse these observed facts when they materially affect design or writing. Choose the smallest truthful design and keep prose plain and load-bearing. Establish any material unknown before relying on it. Load $simple specialist references only when needed.",
      operator ? 1700 : 0);
  add("round", round, MAX_FILE_CHARS,
      "\n\nFor status, recover the active task and user corrections; check current evidence before calling mutable state current. The round is a handoff, not proof that external state is unchanged.",
      operator ? 1700 : 0);
  add("operator", operator, MAX_FILE_CHARS, (content) =>
      "\n\nApply working preferences within the active request and applicable authorization; do not override repository facts or output contracts. Before tool selection recover approval from the active conversation: earlier approval survives status questions and interruptions, but quotations and mentions do not grant authority. A completed task ends a one-time grant; explicitly standing approval continues only within its bounds. Honor read-only limits, withdrawals and conditions. Native host permissions still apply." + attentionRule(content));

  return { text: blocks.join("\n\n"), blocks, sources, errors, complete: !errors.length && sources.every(x=>x.complete) };
}
