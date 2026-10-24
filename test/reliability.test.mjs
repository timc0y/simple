import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { assembleContext } from "../scripts/context.mjs";
import openCode from "../.opencode/plugins/simple.mjs";

function project(name) {
  const dir = mkdtempSync(join(tmpdir(), "simple-context-"));
  writeFileSync(join(dir, "SIMPLE.md"), "# Simple\n\n## Reality\n\n- " + name + "\n");
  return dir;
}

test("one unreadable optional file does not suppress a valid profile", () => {
  const cwd = project("good project");
  const bad = join(cwd, "operator-is-directory.md");
  mkdirSync(bad);
  const result = assembleContext({ cwd, env: { SIMPLE_OPERATOR_FILE: bad } });
  assert.match(result.text, /good project/);
  assert.equal(result.sources.find(x => x.kind === "operator").status, "unavailable");
  assert.equal(result.errors.length, 1);
});

test("the combined budget labels partial sources without silently losing provenance", () => {
  const cwd = project("A".repeat(5600));
  mkdirSync(join(cwd, "simple"));
  writeFileSync(join(cwd, "simple/round.md"), "R".repeat(5900));
  const operator = join(cwd, "operator.md");
  writeFileSync(operator, "O".repeat(5900));
  const result = assembleContext({ cwd, env: { SIMPLE_OPERATOR_FILE: operator } });
  assert.ok(result.text.length <= 12000);
  assert.equal(result.sources.length, 3);
  assert.ok(result.sources.some(x => !x.complete));
  assert.match(result.text, /Partial .* context/);
  assert.ok(result.sources.every(x => x.path && x.sha256));
});

test("attention is opt-in, visible only as an instruction, never an automatic prefix", () => {
  const cwd = project("marker test");
  const operator = join(cwd, "operator.md");
  writeFileSync(operator, "# Operator\n\n- Attention name:\n");
  assert.doesNotMatch(assembleContext({cwd,env:{SIMPLE_OPERATOR_FILE:operator}}).text,/Optional attention marker/);
  writeFileSync(operator, "# Operator\n\n- Attention name: Morgan\n");
  const context = assembleContext({cwd,env:{SIMPLE_OPERATOR_FILE:operator}}).text;
  assert.match(context,/Optional attention marker/);
  assert.match(context,/Morgan,/);
  assert.match(context,/not evidence of correctness/);
  assert.match(context,/Do not replay/);
});

test("two OpenCode instances use their distinct host directories, not process cwd", async () => {
  const a = project("project alpha");
  const b = project("project beta");
  for (const [dir,expected,unwanted] of [[a,"alpha","beta"],[b,"beta","alpha"]]) {
    const plugin = await openCode({directory:dir});
    const output = {system:[]};
    await plugin["experimental.chat.system.transform"]({},output);
    assert.match(output.system.join("\n"), new RegExp(expected));
    assert.doesNotMatch(output.system.join("\n"),new RegExp("project " + unwanted));
    const compaction={context:[]};
    await plugin["experimental.session.compacting"]({},compaction);
    assert.match(compaction.context.join("\n"),new RegExp(expected));
  }
});

test("OpenCode exposes only the plugin factory", async () => {
  const module = await import("../.opencode/plugins/simple.mjs");
  assert.deepEqual(Object.keys(module), ["default"]);
});

test("session hook preserves readable profile when the optional operator is a directory", () => {
  const cwd=project("readable");
  const operator=join(cwd,"unreadable.md");
  mkdirSync(operator);
  const hook=new URL("../scripts/hook.mjs",import.meta.url);
  const result=spawnSync(process.execPath,[fileURLToPath(hook)],{input:JSON.stringify({hook_event_name:"SessionStart",cwd}),encoding:"utf8",env:{...process.env,SIMPLE_OPERATOR_FILE:operator}});
  assert.equal(result.status,0);
  assert.match(JSON.parse(result.stdout).hookSpecificOutput.additionalContext,/readable/);
  assert.match(result.stderr,/context unavailable/);
});

test("normalized evidence rejects empty runs and invented graders", async () => {
  const { validateResults } = await import("../evals/normalize-results.mjs");
  assert.match(validateResults([]).join(" "), /at least one/);
  const good = [{
    schemaVersion: 1,
    recordedAt: "2026-10-23T20:00:00Z",
    skillCommit: "candidate-tree",
    model: { name: "fixture", revision: "fixture", reasoning: "default" },
    harness: "offline",
    condition: "control",
    tasks: [{ id: "case", passed: true, evidence: null, graderVerdicts: { luna: true } }]
  }];
  assert.deepEqual(validateResults(good), []);
  const invented = structuredClone(good);
  invented[0].tasks[0].graderVerdicts.pretend = true;
  assert.match(validateResults(invented).join(" "), /unknown graderVerdicts\.pretend/);
  const negative = structuredClone(good);
  negative[0].tasks[0].costUsd = Infinity;
  assert.match(validateResults(negative).join(" "), /costUsd/);
});
