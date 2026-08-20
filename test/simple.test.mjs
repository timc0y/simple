import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { check, init, MAX_PROFILE_CHARS, setup } from "../skills/simple/scripts/simple.mjs";
import { skillLinks } from "../scripts/link-skill.mjs";

const hook = fileURLToPath(new URL("../scripts/hook.mjs", import.meta.url));
const simpleCli = fileURLToPath(new URL("../skills/simple/scripts/simple.mjs", import.meta.url));

test("the setup compatibility alias creates an incomplete profile idempotently", () => {
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
  assert.ok(check(root).some((failure) => failure.includes("incomplete")));
});

test("init is the public setup command", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const result = spawnSync(process.execPath, [simpleCli, "init", root], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(JSON.parse(result.stdout).ready, false);
  assert.ok(readFileSync(join(root, "AGENTS.md"), "utf8").includes("simple init"));
  assert.equal(init, setup);
});

test("check accepts a completed repository profile", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  completeProfile(root, "root profile");
  assert.deepEqual(check(root), []);
});

test("setup reports incomplete readiness without treating creation as a command failure", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const result = spawnSync(process.execPath, [simpleCli, "setup", root], { encoding: "utf8" });
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ready, false);
  assert.ok(output.failures.some((failure) => failure.includes("incomplete")));
});

test("check keeps injected profiles concise", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  writeFileSync(join(root, "SIMPLE.md"), `${readFileSync(join(root, "SIMPLE.md"), "utf8")}\n${"detail ".repeat(MAX_PROFILE_CHARS)}`);
  assert.ok(check(root).some((failure) => failure.includes("exceeds")));
});

test("session hook injects the nearest nested profile", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  mkdirSync(join(root, "packages"));
  mkdirSync(join(root, "packages", "app"));
  mkdirSync(join(root, "packages", "app", "src"));
  setup(root);
  completeProfile(root, "root profile");
  writeFileSync(join(root, "packages", "app", "SIMPLE.md"), completedProfile(root, "app profile"));
  const result = runHook({ hook_event_name: "SessionStart", cwd: join(root, "packages", "app", "src") });
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.match(output.hookSpecificOutput.additionalContext, /Repository-specific Simple context/);
  assert.match(output.hookSpecificOutput.additionalContext, /app profile/);
  assert.doesNotMatch(output.hookSpecificOutput.additionalContext, /root profile/);
});

test("pre-write hook adds only relevant reminders", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  setup(root);
  completeProfile(root, "writing fixture");

  const markdown = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "*** Update File: docs/design.md" }
  });
  const markdownReminder = JSON.parse(markdown.stdout).hookSpecificOutput.additionalContext;
  assert.match(markdownReminder, /Markdown load-bearing/);
  assert.match(markdownReminder, /plain/);
  assert.match(markdownReminder, /no decorative styling/);

  const code = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "+// Explain the retry." }
  });
  const commentReminder = JSON.parse(code.stdout).hookSpecificOutput.additionalContext;
  assert.match(commentReminder, /Use comments/);
  assert.match(commentReminder, /concise/);

  const ordinary = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "+const answer = 42;" }
  });
  assert.equal(ordinary.stdout, "");

  const architectureWords = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_input: { command: "+const migrationFramework = existingOwner;" }
  });
  assert.equal(architectureWords.stdout, "");
});

test("local install exposes one skill through each supported host", () => {
  assert.deepEqual(skillLinks("/tmp/simple-home"), [
    "/tmp/simple-home/.claude/skills/simple",
    "/tmp/simple-home/.codex/skills/simple",
    "/tmp/simple-home/.config/opencode/skills/simple",
    "/tmp/simple-home/.gemini/config/skills/simple"
  ]);
});

test("design and writing modes stay distinct and capability profiles are bundled", () => {
  const skill = readFileSync(join(process.cwd(), "skills", "simple", "SKILL.md"), "utf8");
  const writing = readFileSync(join(process.cwd(), "skills", "simple", "references", "writing.md"), "utf8");
  const writeCommand = readFileSync(join(process.cwd(), "commands", "write.md"), "utf8");
  const profiles = readFileSync(join(process.cwd(), "skills", "simple", "references", "model-profiles.md"), "utf8");
  const schema = JSON.parse(readFileSync(join(process.cwd(), "evals", "results.schema.json"), "utf8"));
  const site = readFileSync(join(process.cwd(), "src", "pages", "index.astro"), "utf8");
  const marketplace = readFileSync(join(process.cwd(), ".claude-plugin", "marketplace.json"), "utf8");
  const codexPlugin = readFileSync(join(process.cwd(), ".codex-plugin", "plugin.json"), "utf8");

  assert.match(skill, /Writing is a first-class Simple mode/);
  assert.match(skill, /Do not turn a writing task into an architecture review/);
  assert.match(writing, /Plain writing standard/);
  assert.match(writing, /Avoid decorative formatting/);
  assert.match(writeCommand, /smallest useful Markdown structure/);
  assert.match(skill, /autonomous/);
  assert.match(skill, /guided/);
  assert.match(skill, /scripted/);
  assert.match(profiles, /Start with the autonomous profile/);
  assert.equal(schema.properties.condition.enum.length, 3);
  assert.match(site, /What does writing mode produce/);
  assert.match(site, /How does it adapt to frontier models/);
  assert.match(marketplace, /plain developer-writing/);
  assert.match(codexPlugin, /technical-writing/);
  assert.match(codexPlugin, /plain Markdown/);
});

function completedProfile(root, label) {
  return readFileSync(join(root, "SIMPLE.md"), "utf8")
    .replace(/^<!-- simple-profile: incomplete.*-->\n\n/m, "")
    .replace(/^- Stage and users: .*$/m, `- Stage and users: ${label}`);
}

function completeProfile(root, label) {
  writeFileSync(join(root, "SIMPLE.md"), completedProfile(root, label));
}

function runHook(payload) {
  return spawnSync(process.execPath, [hook], {
    input: JSON.stringify(payload),
    encoding: "utf8"
  });
}
