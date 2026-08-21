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
  assert.ok(route.includes("simple emulate"));
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
  assert.match(agents, /simple emulate/);
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
  assert.match(output.hookSpecificOutput.additionalContext, /operator lens only when requested/);
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

test("design, writing, and source-backed operator workflows stay distinct", () => {
  const skill = readFileSync(join(process.cwd(), "skills", "simple", "SKILL.md"), "utf8");
  const writing = readFileSync(join(process.cwd(), "skills", "simple", "references", "writing.md"), "utf8");
  const writeCommand = readFileSync(join(process.cwd(), "commands", "write.md"), "utf8");
  const emulateCommand = readFileSync(join(process.cwd(), "commands", "emulate.md"), "utf8");
  const operator = readFileSync(join(process.cwd(), "skills", "simple", "references", "operator-emulation.md"), "utf8");
  const spacex = readFileSync(join(process.cwd(), "skills", "simple", "references", "operator-lenses", "spacex-five-step.md"), "utf8");
  const theo = readFileSync(join(process.cwd(), "skills", "simple", "references", "operator-lenses", "theo-product-engineer.md"), "utf8");
  const minimal = readFileSync(join(process.cwd(), "skills", "simple", "references", "operator-lenses", "minimal-implementation.md"), "utf8");
  const operatorEval = readFileSync(join(process.cwd(), "evals", "operator-emulation", "graders", "criteria.md"), "utf8");
  const boundaryEval = readFileSync(join(process.cwd(), "evals", "emulation-boundary", "graders", "criteria.md"), "utf8");
  const noLensEval = readFileSync(join(process.cwd(), "evals", "no-operator-lens", "graders", "criteria.md"), "utf8");
  const profiles = readFileSync(join(process.cwd(), "skills", "simple", "references", "model-profiles.md"), "utf8");
  const commandReference = readFileSync(join(process.cwd(), "skills", "simple", "references", "commands.md"), "utf8");
  const openaiPrompt = readFileSync(join(process.cwd(), "skills", "simple", "agents", "openai.yaml"), "utf8");
  const schema = JSON.parse(readFileSync(join(process.cwd(), "evals", "results.schema.json"), "utf8"));
  const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
  const marketplace = readFileSync(join(process.cwd(), ".claude-plugin", "marketplace.json"), "utf8");
  const claudePlugin = readFileSync(join(process.cwd(), ".claude-plugin", "plugin.json"), "utf8");
  const codexPlugin = readFileSync(join(process.cwd(), ".codex-plugin", "plugin.json"), "utf8");

  assert.match(skill, /Writing is a first-class Simple mode/);
  assert.match(skill, /Do not turn a writing task into an architecture\s+review/);
  assert.match(writing, /Plain writing standard/);
  assert.match(writing, /Avoid decorative formatting/);
  assert.match(writeCommand, /smallest\s+useful Markdown structure/);
  assert.match(skill, /Operator emulation is a technique/);
  assert.match(emulateCommand, /source-backed operator emulation/);
  assert.match(operator, /not personality role-play/);
  assert.match(operator, /Parallax audiences and personas/);
  assert.match(spacex, /Apply these steps in order/);
  assert.match(theo, /full-stack type safety/);
  assert.match(minimal, /Stop at the first rung/);
  assert.match(minimal, /Never simplify away/);
  assert.match(operatorEval, /operator prestige/);
  assert.match(boundaryEval, /customer feelings/);
  assert.match(noLensEval, /does not name or apply/);
  assert.match(operator, /opt-in per task/);
  assert.match(skill, /autonomous/);
  assert.match(skill, /guided/);
  assert.match(skill, /scripted/);
  assert.match(profiles, /Start with the autonomous profile/);
  assert.equal(schema.properties.condition.enum.length, 3);
  const taskSchema = schema.properties.tasks.items;
  assert.ok(taskSchema.required.includes("lostFacts"));
  assert.ok(taskSchema.required.includes("formattingViolations"));
  assert.ok(taskSchema.required.includes("operatorAttributionErrors"));
  assert.ok(taskSchema.required.includes("safetyBoundaryViolations"));
  assert.ok(taskSchema.required.includes("unprovenSimulationClaims"));
  assert.match(commandReference, /what must be preserved and what may be replaced/);
  assert.match(commandReference, /complexity removed or avoided/);
  assert.match(openaiPrompt, /operator emulation when requested/);
  assert.match(readme, /timcoy\.uk\/simple/);
  assert.doesNotMatch(readme, /timc0y\.github\.io\/simple/);
  assert.match(marketplace, /plain developer-writing/);
  assert.match(claudePlugin, /timcoy\.uk\/simple/);
  assert.match(codexPlugin, /technical-writing/);
  assert.match(codexPlugin, /plain Markdown/);
  assert.match(codexPlugin, /timcoy\.uk\/simple/);
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
