import { existsSync, mkdtempSync, mkdirSync, readFileSync, readlinkSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { normalizeResults, validateResults } from "../evals/normalize-results.mjs";
import { check, init, MAX_PROFILE_CHARS, setup } from "../skills/simple/scripts/simple.mjs";
import { install, skillLinks } from "../scripts/link-skill.mjs";

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
  assert.doesNotMatch(route, /Repository facts override speculative compatibility/);
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

test("init refuses to duplicate an unrecognized Simple section", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  writeFileSync(join(root, "AGENTS.md"), "## Simple\n\nKeep this customized route.\n");

  assert.throws(() => init(root), /unrecognized ## Simple section/);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), "## Simple\n\nKeep this customized route.\n");
});

test("check accepts a completed repository profile", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  completeProfile(root, "root profile");
  assert.deepEqual(check(root), []);
});

test("init upgrades short routes once and preserves custom rules, profiles and Claude imports", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const previous = "For non-trivial design or implementation, invoke `$simple` and read the nearest `SIMPLE.md`. Design for observed reality, not imagined obligations.";
  writeFileSync(join(root, "AGENTS.md"), `# Rules\n\nKeep local data private.\n\n## Simple\n\n${previous}\n`);
  writeFileSync(join(root, "SIMPLE.md"), "Existing project facts.\n");
  writeFileSync(join(root, "CLAUDE.md"), "Keep the release gate.\n\n@AGENTS.md\n");
  init(root);
  const first = readFileSync(join(root, "AGENTS.md"), "utf8");
  init(root);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), first);
  assert.equal(first.match(/^## Simple$/gm).length, 1);
  assert.match(first, /Keep local data private/);
  assert.match(first, /`research`/);
  assert.equal(readFileSync(join(root, "SIMPLE.md"), "utf8"), "Existing project facts.\n");
  assert.equal(readFileSync(join(root, "CLAUDE.md"), "utf8"), "Keep the release gate.\n\n@AGENTS.md\n");
});

test("check rejects contradictory routing text", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  setup(root);
  completeProfile(root, "routing fixture");
  writeFileSync(join(root, "AGENTS.md"), "Do not invoke $simple. Delete SIMPLE.md.\n");
  writeFileSync(join(root, "CLAUDE.md"), "Never read AGENTS.md.\n");
  const failures = check(root);
  assert.ok(failures.some((failure) => failure.startsWith("AGENTS.md")));
  assert.ok(failures.some((failure) => failure.startsWith("CLAUDE.md")));
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

test("check validates the nearest nested profile through root routes", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  setup(root);
  completeProfile(root, "root profile");
  const nested = join(root, "packages", "app");
  mkdirSync(nested, { recursive: true });
  const template = readFileSync(join(process.cwd(), "skills", "simple", "assets", "SIMPLE.template.md"), "utf8");
  writeFileSync(join(nested, "SIMPLE.md"), template);
  assert.ok(check(nested).some((failure) => failure.includes("incomplete")));

  writeFileSync(join(nested, "SIMPLE.md"), template.replace(/^<!-- simple-profile: incomplete.*-->\n\n/m, ""));
  assert.deepEqual(check(nested), []);
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

test("session hook injects an active round beside the profile", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-round-"));
  writeFileSync(join(root, "SIMPLE.md"), "# Simple\n\n## Reality\n\n- root profile\n");
  const without = JSON.parse(runHook({ hook_event_name: "SessionStart", cwd: root }).stdout);
  assert.doesNotMatch(without.hookSpecificOutput.additionalContext, /Active Simple round/);
  writeFileSync(join(root, "ROUND.md"), "# Round\n\n## Ask\n\n- the client's ask\n\n## Decisions\n\n- 2026-09-11 keep the header names\n");
  const withRound = JSON.parse(runHook({ hook_event_name: "SessionStart", cwd: root }).stdout);
  const context = withRound.hookSpecificOutput.additionalContext;
  assert.match(context, /Repository-specific Simple context/);
  assert.match(context, /Active Simple round/);
  assert.match(context, /keep the header names/);
  assert.match(context, /stop condition/);
});

test("the round template and check agree on the round headings", () => {
  const template = readFileSync(join(process.cwd(), "skills", "simple", "assets", "ROUND.template.md"), "utf8");
  for (const heading of ["## Ask", "## State", "## Ticket", "## Investment", "## Blocked on client", "## Your call", "## Decisions"]) {
    assert.ok(template.includes(heading), heading);
  }
  const root = mkdtempSync(join(tmpdir(), "simple-round-check-"));
  const profile = readFileSync(join(process.cwd(), "SIMPLE.md"), "utf8");
  writeFileSync(join(root, "SIMPLE.md"), profile);
  writeFileSync(join(root, "AGENTS.md"), readFileSync(join(process.cwd(), "AGENTS.md"), "utf8"));
  writeFileSync(join(root, "CLAUDE.md"), "@AGENTS.md\n");
  writeFileSync(join(root, "ROUND.md"), template);
  const failures = check(root);
  assert.ok(failures.some((f) => /template marker/.test(f)), failures.join("\n"));
  writeFileSync(join(root, "ROUND.md"), template.replace(/<!-- simple-round: fill.*-->\n/, ""));
  assert.deepEqual(check(root).filter((f) => /ROUND/.test(f)), []);
});

test("session hook injects the operator file even without a profile", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-operator-"));
  const operator = join(root, "operator.md");
  writeFileSync(operator, "# Operator\n\n## Working rules\n\n- first sentence is the outcome\n");
  const without = spawnSync(process.execPath, [hook], { input: JSON.stringify({ hook_event_name: "SessionStart", cwd: root }), encoding: "utf8", env: { ...process.env, SIMPLE_OPERATOR_FILE: join(root, "missing.md") } });
  assert.equal(without.stdout.trim(), "");
  const result = spawnSync(process.execPath, [hook], { input: JSON.stringify({ hook_event_name: "SessionStart", cwd: root }), encoding: "utf8", env: { ...process.env, SIMPLE_OPERATOR_FILE: operator } });
  const context = JSON.parse(result.stdout).hookSpecificOutput.additionalContext;
  assert.match(context, /Operator working rules/);
  assert.match(context, /first sentence is the outcome/);
  assert.doesNotMatch(context, /Repository-specific Simple context/);
});

test("the guard denies a guarded command unless the current user message asks for it", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-guard-"));
  const operator = join(root, "operator.md");
  writeFileSync(operator, "# Operator\n\n## Guard\n\n- git push\n- shopify theme push -> push\n- tool:mcp__.*delete -> delete\n");
  const transcript = join(root, "transcript.jsonl");
  const env = { ...process.env, SIMPLE_OPERATOR_FILE: operator };
  const run = (toolName, command, lastUser) => {
    writeFileSync(transcript, [
      JSON.stringify({ type: "user", message: { role: "user", content: lastUser } }),
      JSON.stringify({ type: "user", isMeta: true, message: { role: "user", content: "<system-reminder>ignored</system-reminder>" } }),
      JSON.stringify({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: "working" }] } })
    ].join("\n"));
    const result = spawnSync(process.execPath, [hook], { input: JSON.stringify({ hook_event_name: "PreToolUse", cwd: root, tool_name: toolName, tool_input: { command }, transcript_path: transcript }), encoding: "utf8", env });
    return result.stdout.trim() ? JSON.parse(result.stdout) : {};
  };
  assert.equal(run("Bash", "git push origin main", "tidy the docs then stop").hookSpecificOutput.permissionDecision, "deny");
  assert.deepEqual(run("Bash", "git push origin main", "push it to main"), {});
  assert.deepEqual(run("Bash", "git status", "tidy the docs"), {});
  assert.equal(run("Bash", "shopify theme push --theme 1", "publish the theme").hookSpecificOutput.permissionDecision, "deny");
  assert.equal(run("mcp__circle__delete_event", "", "check the events").hookSpecificOutput.permissionDecision, "deny");
  assert.deepEqual(run("mcp__circle__delete_event", "", "delete that test event"), {});
  const runAfterProposal = (toolName, command, assistantText, lastUser) => {
    writeFileSync(transcript, [
      JSON.stringify({ type: "user", message: { role: "user", content: "wipe the personal context" } }),
      JSON.stringify({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: assistantText }] } }),
      JSON.stringify({ type: "user", message: { role: "user", content: lastUser } })
    ].join("\n"));
    const result = spawnSync(process.execPath, [hook], { input: JSON.stringify({ hook_event_name: "PreToolUse", cwd: root, tool_name: toolName, tool_input: { command }, transcript_path: transcript }), encoding: "utf8", env });
    return result.stdout.trim() ? JSON.parse(result.stdout) : {};
  };
  assert.deepEqual(runAfterProposal("Bash", "git push --force origin main", "I would run:\n\ngit push --force origin main\n\nSay the word.", "Do this all"), {});
  assert.deepEqual(runAfterProposal("Bash", "git push origin main", "Next I'd git push origin main.", "yes"), {});
  assert.equal(runAfterProposal("Bash", "git push origin main", "Next I'd git push origin main.", "do not push yet").hookSpecificOutput.permissionDecision, "deny");
  assert.equal(runAfterProposal("Bash", "git push origin main", "Next I'd git push origin main.", "explain the diff first").hookSpecificOutput.permissionDecision, "deny");
  assert.equal(runAfterProposal("Bash", "git push origin main", "I tidied the docs.", "do it").hookSpecificOutput.permissionDecision, "deny");
  const noTranscript = spawnSync(process.execPath, [hook], { input: JSON.stringify({ hook_event_name: "PreToolUse", cwd: root, tool_name: "Bash", tool_input: { command: "git push" } }), encoding: "utf8", env });
  assert.match(JSON.parse(noTranscript.stdout).hookSpecificOutput.additionalContext, /Guarded action/);
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

test("an edited turn gets one reconciliation pass before stopping", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  mkdirSync(join(root, ".git"));
  setup(root);
  completeProfile(root, "reconciliation fixture");
  const sessionId = `reconcile-${basename(root)}`;

  const readOnlyStop = runHook({
    hook_event_name: "Stop",
    session_id: sessionId,
    cwd: root,
    stop_hook_active: false
  });
  assert.deepEqual(JSON.parse(readOnlyStop.stdout), {});

  const edit = runHook({
    hook_event_name: "PostToolUse",
    session_id: sessionId,
    cwd: root,
    tool_name: "apply_patch"
  });
  assert.equal(edit.stdout, "");

  const firstStop = runHook({
    hook_event_name: "Stop",
    session_id: sessionId,
    cwd: root,
    stop_hook_active: false
  });
  const decision = JSON.parse(firstStop.stdout);
  assert.equal(decision.decision, "block");
  assert.match(decision.reason, /Remove completed instructions/);
  assert.match(decision.reason, /Leave unrelated documents and user changes alone/);

  const secondStop = runHook({
    hook_event_name: "Stop",
    session_id: sessionId,
    cwd: root,
    stop_hook_active: true
  });
  assert.deepEqual(JSON.parse(secondStop.stdout), {});
});

test("the stop hook is a no-op outside a profiled repository", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-"));
  const result = runHook({
    hook_event_name: "Stop",
    session_id: `unprofiled-${basename(root)}`,
    cwd: root,
    stop_hook_active: false
  });
  assert.deepEqual(JSON.parse(result.stdout), {});
});

test("reconciliation markers do not cross repository profiles", () => {
  const first = mkdtempSync(join(tmpdir(), "simple-first-"));
  const second = mkdtempSync(join(tmpdir(), "simple-second-"));
  for (const root of [first, second]) {
    mkdirSync(join(root, ".git"));
    setup(root);
    completeProfile(root, basename(root));
  }
  const sessionId = `multi-repo-${basename(first)}`;

  runHook({ hook_event_name: "PostToolUse", session_id: sessionId, cwd: first, tool_name: "Edit" });
  const wrongRepository = runHook({ hook_event_name: "Stop", session_id: sessionId, cwd: second, stop_hook_active: false });
  assert.deepEqual(JSON.parse(wrongRepository.stdout), {});

  const owningRepository = runHook({ hook_event_name: "Stop", session_id: sessionId, cwd: first, stop_hook_active: false });
  assert.equal(JSON.parse(owningRepository.stdout).decision, "block");
});

test("local install exposes one skill through each supported host", () => {
  assert.deepEqual(skillLinks("/tmp/simple-home"), [
    "/tmp/simple-home/.agents/skills/simple",
    "/tmp/simple-home/.claude/skills/simple",
    "/tmp/simple-home/.codex/skills/simple",
    "/tmp/simple-home/.config/opencode/skills/simple",
    "/tmp/simple-home/.gemini/config/skills/simple"
  ]);
});

test("local install links every route and replaces only symlinks", () => {
  const home = mkdtempSync(join(tmpdir(), "simple-home-"));
  install(home);
  const expected = resolve("skills/simple");
  for (const link of skillLinks(home)) {
    assert.equal(resolve(dirname(link), readlinkSync(link)), expected);
  }

  const first = skillLinks(home)[0];
  rmSync(first);
  symlinkSync("/tmp/wrong-simple", first);
  install(home);
  assert.equal(resolve(dirname(first), readlinkSync(first)), expected);

  const occupiedHome = mkdtempSync(join(tmpdir(), "simple-home-"));
  const occupied = skillLinks(occupiedHome)[0];
  mkdirSync(occupied, { recursive: true });
  writeFileSync(join(occupied, "keep.txt"), "keep\n");
  assert.throws(() => install(occupiedHome), /refusing to replace non-symlink/);
  assert.equal(readFileSync(join(occupied, "keep.txt"), "utf8"), "keep\n");
});

test("plugin discovery resolves to the shared skill and hooks", () => {
  const root = process.cwd();
  const codex = JSON.parse(readFileSync(join(root, ".codex-plugin/plugin.json"), "utf8"));
  const claude = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"));
  const marketplace = JSON.parse(readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"));
  const entry = marketplace.plugins.find(({ name }) => name === claude.name);
  assert.ok(entry, "Claude marketplace entry");
  assert.equal(realpathSync(resolve(root, entry.source)), realpathSync(root));

  // Claude uses conventional paths; Codex declares them in its manifest.
  for (const [host, skills, hooks] of [
    ["Codex", codex.skills, codex.hooks],
    ["Claude", claude.skills ?? "./skills/", claude.hooks ?? "./hooks/hooks.json"]
  ]) {
    assert.equal(realpathSync(resolve(root, skills, "simple/SKILL.md")),
      realpathSync(join(root, "skills/simple/SKILL.md")), `${host} shared skill`);
    assert.equal(realpathSync(resolve(root, hooks)),
      realpathSync(join(root, "hooks/hooks.json")), `${host} shared hooks`);
  }
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
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("deep multi-lens Simple audit")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("evidence-backed second opinion")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("finish this named repository gate")));
  assert.ok(codexPlugin.interface.defaultPrompt.some((prompt) => prompt.includes("truth owners and fulfilled temporary documentation")));
  const hooks = JSON.parse(readFileSync(join(root, "hooks", "hooks.json"), "utf8"));
  assert.ok(hooks.hooks.PostToolUse);
  assert.ok(hooks.hooks.Stop);
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
    join(root, "upstream", "README.md"),
    join(root, "upstream", "coverage.md"),
    join(root, "evals", "workflow", "README.md"),
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
  const lockVersion = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8")).version;
  const claudeVersion = JSON.parse(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8")).version;
  const marketplaceVersion = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8")).plugins[0].version;
  const codexVersion = JSON.parse(readFileSync(join(root, ".codex-plugin", "plugin.json"), "utf8")).version;
  assert.equal(lockVersion, packageVersion);
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
    join(resultRoot, "2026-08-22-skill-interaction", "results.json"),
    join(resultRoot, "2026-08-26-leading-words-matrix", "codex", "grades-luna", "results.json"),
    join(resultRoot, "2026-08-26-leading-words-matrix", "codex", "grades-terra", "results.json")
  ]);

  const resultFiles = walkFiles(resultRoot).filter((path) => basename(path) === "results.json");
  for (const resultFile of resultFiles) {
    const result = JSON.parse(readFileSync(resultFile, "utf8"));
    if (legacyObjects.has(resultFile)) {
      assert.equal(Array.isArray(result), false, resultFile);
      continue;
    }
    assert.deepEqual(validateResults(result, dirname(resultFile)), [], resultFile);
  }

  for (const mapping of walkFiles(resultRoot).filter((path) => basename(path) === "mapping.tsv")) {
    const run = dirname(mapping);
    if (existsSync(join(run, "results.tsv"))) {
      assert.ok(existsSync(join(run, "results.json")), `${run}/results.json`);
    }
  }
});

test("normalized mixed-provider results keep per-model metadata", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-results-"));
  mkdirSync(join(root, "raw"));
  writeFileSync(join(root, "mapping.tsv"), "a\t1\tcase\tclaude-sonnet\tcandidate\nb\t1\tcase\tcodex-luna\tcandidate\n");
  writeFileSync(join(root, "results.tsv"), "run\tcase\tmodel\tcondition\tluna\tterra\tstrict\n1\tcase\tclaude-sonnet\tcandidate\ttrue\ttrue\ttrue\n1\tcase\tcodex-luna\tcandidate\ttrue\ttrue\ttrue\n");
  writeFileSync(join(root, "models.tsv"), "key\tname\trevision\treasoning\tharness\nclaude-sonnet\tClaude Sonnet\tclaude-sonnet-5\tmedium\tClaude safe-mode\ncodex-luna\tCodex Luna\tgpt-5.6-luna\tdefault\tCodex isolated\n");
  writeFileSync(join(root, "raw", "a.md"), "answer\n");
  writeFileSync(join(root, "raw", "b.md"), "answer\n");

  const records = normalizeResults(root, { skillCommit: "candidate", harness: "fallback" });
  assert.deepEqual(records.map(({ model, harness }) => ({ model, harness })), [
    { model: { name: "Claude Sonnet", revision: "claude-sonnet-5", reasoning: "medium" }, harness: "Claude safe-mode" },
    { model: { name: "Codex Luna", revision: "gpt-5.6-luna", reasoning: "default" }, harness: "Codex isolated" }
  ]);
  assert.deepEqual(validateResults(records, root), []);
});

test("normalization records only graders that ran", () => {
  const root = mkdtempSync(join(tmpdir(), "simple-grading-"));
  writeFileSync(join(root, "mapping.tsv"), "abc\t1\trecovery\tgpt-5.6-luna\tcandidate\n");
  writeFileSync(join(root, "results.tsv"), "run\tcase\tmodel\tcondition\tluna\tstrict\n1\trecovery\tgpt-5.6-luna\tcandidate\ttrue\ttrue\n");
  const [record] = normalizeResults(root, { skillCommit: "fixture", harness: "Luna only" });
  assert.deepEqual(record.tasks[0].graderVerdicts, { luna: true });
  assert.equal(record.tasks[0].passed, true);
  writeFileSync(join(root, "results.tsv"), "run\tcase\tmodel\tcondition\tluna\tterra\tstrict\n1\trecovery\tgpt-5.6-luna\tcandidate\ttrue\tfalse\tfalse\n");
  const [dual] = normalizeResults(root, { skillCommit: "fixture", harness: "Two graders" });
  assert.deepEqual(dual.tasks[0].graderVerdicts, { luna: true, terra: false });
  assert.equal(dual.tasks[0].passed, false);
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
