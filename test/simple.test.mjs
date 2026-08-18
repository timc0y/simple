import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { check, MAX_PROFILE_CHARS, setup } from "../skills/simple/scripts/simple.mjs";

const hook = fileURLToPath(new URL("../scripts/hook.mjs", import.meta.url));

test("setup creates the route and profile idempotently", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  const firstAgents = readFileSync(join(root, "AGENTS.md"), "utf8");
  const firstClaude = readFileSync(join(root, "CLAUDE.md"), "utf8");
  const firstProfile = readFileSync(join(root, "SIMPLE.md"), "utf8");
  setup(root);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), firstAgents);
  assert.equal(readFileSync(join(root, "CLAUDE.md"), "utf8"), firstClaude);
  assert.equal(readFileSync(join(root, "SIMPLE.md"), "utf8"), firstProfile);
  assert.equal(firstClaude, "@AGENTS.md\n");
  assert.deepEqual(check(root), []);
});

test("check requires complete precedent evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  writeFileSync(join(root, "SIMPLE.md"), `${readFileSync(join(root, "SIMPLE.md"), "utf8")}\n## Precedent: incomplete\n\nNeed:\n`);
  assert.ok(check(root).some((failure) => failure.includes("Reconsider when:")));
});

test("check keeps injected profiles concise", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  writeFileSync(join(root, "SIMPLE.md"), `${readFileSync(join(root, "SIMPLE.md"), "utf8")}\n${"detail ".repeat(MAX_PROFILE_CHARS)}`);
  assert.ok(check(root).some((failure) => failure.includes("exceeds")));
});

test("session hook injects the nearest profile from a nested directory", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  mkdirSync(join(root, "src"));
  setup(root);
  const result = runHook({ hook_event_name: "SessionStart", cwd: join(root, "src") });
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.match(output.hookSpecificOutput.additionalContext, /Repository-specific Simple context/);
  assert.match(output.hookSpecificOutput.additionalContext, /Stage and users/);
});

test("pre-write hook adds only relevant reminders", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  setup(root);

  const markdown = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "*** Update File: docs/design.md" }
  });
  assert.match(JSON.parse(markdown.stdout).hookSpecificOutput.additionalContext, /Markdown load-bearing/);

  const code = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "+// Explain the retry." }
  });
  assert.match(JSON.parse(code.stdout).hookSpecificOutput.additionalContext, /Comments explain/);

  const ordinary = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "+const answer = 42;" }
  });
  assert.equal(ordinary.stdout, "");
});

function runHook(payload) {
  return spawnSync(process.execPath, [hook], {
    input: JSON.stringify(payload),
    encoding: "utf8"
  });
}
