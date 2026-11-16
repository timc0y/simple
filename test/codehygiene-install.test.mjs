import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { install, skillLinks } from "../scripts/link-skill.mjs";
import { CODEHYGIENE_SOURCE, installCodehygiene } from "../skills/simple/scripts/codehygiene.mjs";

function home(t) {
  const path = mkdtempSync(join(tmpdir(), "simple optional install "));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}

test("ordinary skill install does not install an external tool", (t) => {
  const path = home(t);
  install(path, { installTool() { assert.fail("unexpected external install"); } });
  assert.ok(skillLinks(path).every(existsSync));
});

test("optional tool installation follows preflight and precedes links", (t) => {
  const path = home(t);
  let calls = 0;
  install(path, { withCodehygiene: true, installTool() {
    calls++;
    assert.ok(skillLinks(path).every((link) => !existsSync(link)));
  } });
  assert.equal(calls, 1);
  assert.ok(skillLinks(path).every(existsSync));

  const occupied = home(t);
  mkdirSync(skillLinks(occupied).at(-1), { recursive: true });
  assert.throws(() => install(occupied, { withCodehygiene: true, installTool() {
    assert.fail("collision must prevent tool install");
  } }), /refusing to replace/);
});

test("tool installation failure leaves link destinations unchanged", (t) => {
  const path = home(t);
  assert.throws(() => install(path, { withCodehygiene: true, installTool() {
    throw new Error("tool install failed");
  } }), /tool install failed/);
  assert.ok(skillLinks(path).every((link) => !existsSync(link)));
});

test("tool installer pins source without forced replacement or Python downloads", () => {
  installCodehygiene((command, args, options) => {
    assert.equal(command, "uv");
    assert.deepEqual(args, ["tool", "install", "--no-python-downloads", `codehygiene @ ${CODEHYGIENE_SOURCE}`]);
    assert.equal(options.shell, undefined);
    return { status: 0 };
  });
  assert.throws(() => installCodehygiene(() => ({ error: new Error("ENOENT") })), /Install uv and Python/);
  assert.throws(() => installCodehygiene(() => ({ status: 2 })), /installation failed/);
});

test("bundled installer needs no checkout files and invalid arguments cannot install", (t) => {
  const path = home(t);
  const skill = join(path, "skill copy");
  cpSync(new URL("../skills/simple/", import.meta.url), skill, { recursive: true });
  const run = spawnSync(process.execPath, [join(skill, "scripts/codehygiene.mjs"), "unexpected"], { encoding: "utf8" });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /Usage:/);
});
