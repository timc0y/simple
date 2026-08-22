import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
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
  const route = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.ok(route.includes("simple init"));
  assert.ok(route.includes("`write`"));
  assert.equal(init, setup);
});

test("init upgrades the canonical legacy route without replacing custom instructions", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const legacy = "Before a change where repository facts could change the implementation, invoke `$simple` and read the nearest `SIMPLE.md`. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `plan`, `review`, or `check` for an explicit Simple workflow.";
  writeFileSync(join(root, "AGENTS.md"), `# Repository instructions\n\nKeep this custom rule.\n\n## Simple\n\n${legacy}\n`);

  init(root);

  const agents = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.match(agents, /Keep this custom rule/);
  assert.match(agents, /`write`/);
  assert.doesNotMatch(agents, /Before a change where repository facts could change/);
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
  assert.match(output.hookSpecificOutput.additionalContext, /design or writing/);
  assert.match(output.hookSpecificOutput.additionalContext, /plain and load-bearing/);
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

test("published surfaces reference files that exist", () => {
  const root = process.cwd();
  const sources = [
    join(root, "skills", "simple", "SKILL.md"),
    ...readdirSync(join(root, "commands")).map((name) => join(root, "commands", name))
  ];
  const referenced = new Set();
  for (const source of sources) {
    for (const [, name] of readFileSync(source, "utf8").matchAll(/references\/([a-z-]+\.md)/g)) {
      referenced.add(name);
    }
  }
  assert.ok(referenced.size >= 8);
  for (const name of referenced) {
    assert.ok(existsSync(join(root, "skills", "simple", "references", name)), name);
  }

  const commandReference = readFileSync(join(root, "skills", "simple", "references", "commands.md"), "utf8");
  for (const file of readdirSync(join(root, "commands"))) {
    assert.ok(commandReference.includes(`## \`simple ${file.replace(/\.md$/, "")}\``), file);
  }

  for (const lens of ["theo-product-engineer.md", "minimal-implementation.md"]) {
    assert.ok(existsSync(join(root, "skills", "simple", "references", "operator-lenses", lens)), lens);
  }
  JSON.parse(readFileSync(join(root, "evals", "results.schema.json"), "utf8"));

  const published = ["README.md", ".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".codex-plugin/plugin.json"];
  for (const path of published) {
    assert.doesNotMatch(readFileSync(join(root, path), "utf8"), /timc0y\.github\.io/, path);
  }
  assert.match(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"), /timcoy\.uk\/simple/);
  assert.match(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8"), /timcoy\.uk\/simple/);
});

test("every eval grader ships self-test references", () => {
  const evalRoot = join(process.cwd(), "evals");
  for (const entry of readdirSync(evalRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!existsSync(join(evalRoot, entry.name, "graders", "criteria.md"))) continue;
    for (const ref of ["pass.md", "fail.md"]) {
      assert.ok(existsSync(join(evalRoot, entry.name, "graders", "references", ref)), `${entry.name}/${ref}`);
    }
  }
});

test("evals that request repository context include a SIMPLE.md fixture", () => {
  const evalRoot = join(process.cwd(), "evals");
  for (const entry of readdirSync(evalRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const prompt = join(evalRoot, entry.name, "prompt.md");
    if (!existsSync(prompt)) continue;
    const text = readFileSync(prompt, "utf8");
    if (text.includes("SIMPLE.md")) {
      assert.equal(existsSync(join(evalRoot, entry.name, "SIMPLE.md")), true, entry.name);
    }
  }
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
