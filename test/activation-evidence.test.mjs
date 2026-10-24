import test from "node:test";
import assert from "node:assert/strict";
import { classifyEvidence } from "../evals/activation/evidence.mjs";

const workspace = "/tmp/simple cell/a";
const relative = ".agents/skills/simple/SKILL.md";
const final = { type: "item.completed", item: { id: "final", type: "agent_message", text: "Done." } };
const done = { type: "turn.completed" };
const cmd = (command, overrides = {}, type = "item.completed") => ({ type,
  item: { id: "read", type: "command_execution", command, status: "completed", exit_code: 0, aggregated_output: "skill text", ...overrides } });
const trace = (...events) => events.map((event) => JSON.stringify(event)).join("\n");
const run = (...events) => classifyEvidence(trace(...events, final, done), workspace, 0);

test("only successfully completed literal reads of the exact workspace skill activate", () => {
  for (const command of [`cat ${relative}`, `cat '${workspace}/${relative}'`, `cat ./${relative}`,
    `sed -n '1,80p' ${relative}`, `head -n20 ${relative}`, `head -n 20 ${relative}`,
    `/bin/zsh -lc 'cat ${relative}'`, `/bin/bash -c "cat ${relative}"`]) {
    assert.deepEqual(run(cmd(command)), { status: "valid", activated: true, reason: "successful-skill-read" }, command);
  }
});

test("prose, listings and wrong-workspace paths are valid non-activation", () => {
  for (const command of [`echo '${relative}'`, `ls ${relative}`, `cat /tmp/other/${relative}`, "date"]) {
    assert.deepEqual(run(cmd(command)), { status: "valid", activated: false, reason: "no-supported-skill-read" }, command);
  }
  assert.equal(run({ ...final, item: { ...final.item, text: `I should read ${relative}` } }).activated, false);
  assert.equal(run(cmd(`cat ${relative}`, { cwd: "/tmp/other" })).activated, false);
});

test("missing or failed read evidence is invalid, never a successful non-activation", () => {
  for (const command of [cmd(`cat ${relative}`, { exit_code: 1 }), cmd(`cat ${relative}`, { aggregated_output: "" }),
    cmd(`cat ${relative}`, { status: "in_progress" }), cmd(`cat ${relative}`, {}, "item.failed"),
    cmd(`cat ${relative}`, { id: undefined }), cmd(`cat ${relative}`, {}, "item.started")]) {
    assert.equal(run(command).status, "invalid");
    assert.equal(run(command).activated, null);
  }
});

test("changed directories, compound shells, unknown readers and quote tricks remain unresolved", () => {
  for (const command of [`cd elsewhere && cat ${relative}`, `cat ${relative}; echo done`,
    `python3 -c 'open("${relative}").read()'`, `cat "${relative}`, `cat '${relative}'junk`,
    `cat ../a/${relative}`, `cat ${relative} | head`, `cat \"$(echo ${relative})\"`,
    `/bin/bash -lc 'cd somewhere; cat ${relative}'`, "cd elsewhere"]) {
    assert.equal(run(cmd(command)).status, "invalid", command);
  }
});

test("solver exit, complete turn and nonempty final are required", () => {
  for (const exit of [1, 124, null, undefined, "0"]) assert.equal(classifyEvidence(trace(final, done), workspace, exit).status, "invalid");
  for (const content of ["{broken", "null", trace(final), trace(done),
    trace({ ...final, item: { ...final.item, text: " " } }, done),
    trace(final, done, cmd(`cat ${relative}`)), trace(final, done, done),
    trace(final, cmd(`cat ${relative}`), done),
    trace({ ...final, item: { ...final.item, phase: "commentary" } }, done),
    trace({ type: "turn.failed" }, final, done), trace({ type: "error" }, final, done)]) {
    assert.equal(classifyEvidence(content, workspace, 0).status, "invalid", content);
  }
});

test("a new tool event cannot silently masquerade as no activation", () => {
  for (const type of ["file_read", "mcp_tool_call", "future_tool"]) {
    assert.equal(run({ type: "item.completed", item: { type, path: relative } }).status, "invalid");
  }
});

test("started commands need completion, and duplicate terminal identities are rejected", () => {
  assert.equal(run(cmd(`cat ${relative}`, {}, "item.started"), cmd(`cat ${relative}`)).activated, true);
  assert.equal(run(cmd(`cat ${relative}`), cmd(`cat ${relative}`)).status, "invalid");
});

test("the old path grep is a negative control, not activation evidence", () => {
  const content = trace(cmd(`echo '${relative}'`), final, done);
  assert.match(content, /agents\/skills\/simple\/SKILL\.md/);
  assert.equal(classifyEvidence(content, workspace, 0).activated, false);
});
