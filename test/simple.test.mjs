import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { validateResults } from "../evals/normalize-results.mjs";
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
  for (const command of publicCommands().filter((command) => command !== "init")) {
    assert.ok(route.includes(`\`${command}\``), command);
  }
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

test("init adds board to the previous public route", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const previous = "Invoke `$simple` and read the nearest `SIMPLE.md` before decisions repository facts could change: architecture, ownership, compatibility, migration, deletion, or broad refactoring. Use Simple writing mode for plans, documentation, comments, and handoffs that should be concise, plain, and load-bearing. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `plan`, `review`, `write`, `emulate`, or `check` for an explicit Simple workflow.";
  writeFileSync(join(root, "AGENTS.md"), `## Simple\n\n${previous}\n`);

  init(root);

  assert.match(readFileSync(join(root, "AGENTS.md"), "utf8"), /`board`/);
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

test("edit hook routes only relevant review reminders", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  setup(root);
  completeProfile(root, "writing fixture");

  const markdown = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "apply_patch",
    tool_input: { command: "*** Update File: docs/design.md" }
  });
  const markdownReminder = JSON.parse(markdown.stdout).hookSpecificOutput.additionalContext;
  assert.match(markdownReminder, /Review the Markdown edit/);
  assert.match(markdownReminder, /no decorative styling/);

  const code = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "apply_patch",
    tool_input: { command: "+// Explain the retry." }
  });
  const commentReminder = JSON.parse(code.stdout).hookSpecificOutput.additionalContext;
  assert.match(commentReminder, /Review each added comment/);
  assert.match(commentReminder, /non-obvious reasons/);

  const removedComment = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "Edit",
    tool_input: { old_string: "// Narrate the call.", new_string: "run();" }
  });
  assert.equal(removedComment.stdout, "");

  const unchangedComment = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "apply_patch",
    tool_input: { patch: " // Existing context.\n+run();" }
  });
  assert.equal(unchangedComment.stdout, "");

  const ordinary = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "apply_patch",
    tool_input: { command: "+const answer = 42;" }
  });
  assert.equal(ordinary.stdout, "");

  const architectureWords = runHook({
    hook_event_name: "PreToolUse",
    cwd: root,
    tool_name: "apply_patch",
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
  const readme = readFileSync(join(root, "README.md"), "utf8");
  for (const file of readdirSync(join(root, "commands"))) {
    const command = file.replace(/\.md$/, "");
    assert.ok(commandReference.includes(`## \`simple ${command}\``), file);
    assert.ok(readme.includes(`| \`simple ${command}\``), file);
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
  const codexPlugin = JSON.parse(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8"));
  assert.match(codexPlugin.homepage, /timcoy\.uk\/simple/);
  assert.ok(existsSync(join(root, codexPlugin.hooks)), "codex hooks file");
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("nail down the problem")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("flow easy to picture")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("lint, tests, and code-health checks")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("evidence-backed second opinion")));
  const hooks = JSON.parse(readFileSync(join(root, "hooks", "hooks.json"), "utf8"));
  for (const event of Object.values(hooks.hooks)) {
    for (const block of event) {
      for (const h of block.hooks) assert.match(h.command, /\$\{CLAUDE_PLUGIN_ROOT\}/);
    }
  }
});

test("maintained Markdown links resolve", () => {
  const root = process.cwd();
  const maintained = [
    join(root, "README.md"),
    join(root, "SIMPLE.md"),
    join(root, "evals", "README.md"),
    ...walkFiles(join(root, "commands")).filter((path) => path.endsWith(".md")),
    ...walkFiles(join(root, "skills", "simple")).filter((path) => path.endsWith(".md")),
    ...walkFiles(join(root, "research")).filter((path) => path.endsWith(".md")),
    ...walkFiles(join(root, "evals", "results")).filter((path) => /\/(README|RESULTS)\.md$/.test(path))
  ];

  for (const source of maintained) {
    for (const match of readFileSync(source, "utf8").matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      assert.ok(existsSync(resolveMarkdownLink(source, target)), `${source} -> ${target}`);
    }
  }
});

test("release surfaces share one base version", () => {
  const root = process.cwd();
  const packageVersion = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  const claudeVersion = JSON.parse(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8")).version;
  const marketplaceVersion = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8")).plugins[0].version;
  const codexVersion = JSON.parse(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8")).version;
  assert.equal(claudeVersion, packageVersion);
  assert.equal(marketplaceVersion, packageVersion);
  assert.equal(codexVersion.split("+")[0], packageVersion);
});

test("every eval grader ships self-test references", () => {
  const evalRoot = join(process.cwd(), "evals");
  const criteriaFiles = walkFiles(evalRoot).filter((path) => path.endsWith(join("graders", "criteria.md")) && !path.includes(join("evals", "results")));
  assert.ok(criteriaFiles.length >= 30);
  for (const criteria of criteriaFiles) {
    const graderRoot = dirname(criteria);
    for (const ref of ["pass.md", "fail.md"]) {
      assert.ok(existsSync(join(graderRoot, "references", ref)), `${criteria}/${ref}`);
    }
  }
});

test("evals that request repository context include a SIMPLE.md fixture", () => {
  const evalRoot = join(process.cwd(), "evals");
  const prompts = walkFiles(evalRoot).filter((path) => path.endsWith("prompt.md") && !path.includes(join("evals", "results")));
  for (const prompt of prompts) {
    const text = readFileSync(prompt, "utf8");
    if (text.includes("SIMPLE.md")) {
      assert.equal(existsSync(join(dirname(prompt), "SIMPLE.md")), true, prompt);
    }
  }
});

test("normalized eval results match their evidence", () => {
  const resultRoot = join(process.cwd(), "evals", "results");
  const legacyObjects = new Set([
    join(resultRoot, "2026-08-21-local-sonnet", "results.json"),
    join(resultRoot, "2026-08-22-skill-interaction", "results.json")
  ]);

  const resultFiles = readdirSync(resultRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(resultRoot, entry.name, "results.json"))
    .filter(existsSync);
  for (const resultFile of resultFiles) {
    const result = JSON.parse(readFileSync(resultFile, "utf8"));
    if (legacyObjects.has(resultFile)) {
      assert.equal(Array.isArray(result), false, resultFile);
      continue;
    }
    assert.deepEqual(validateResults(result, dirname(resultFile)), [], resultFile);
  }

  for (const entry of readdirSync(resultRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const run = join(resultRoot, entry.name);
    if (existsSync(join(run, "mapping.tsv")) && existsSync(join(run, "results.tsv"))) {
      assert.ok(existsSync(join(run, "results.json")), `${entry.name}/results.json`);
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

function walkFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

function publicCommands() {
  return readdirSync(join(process.cwd(), "commands"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();
}

function resolveMarkdownLink(source, target) {
  return join(dirname(source), decodeURIComponent(target));
}
