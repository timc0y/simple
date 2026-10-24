import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("offline fixture checks do not disable isolation on any model execution path", () => {
  const script = fileURLToPath(new URL("../evals/preservation/isolation-selftest.py", import.meta.url));
  const result = spawnSync("python3", [script], { encoding: "utf8", timeout: 30000 });
  assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
  assert.match(result.stderr, /Ran 4 tests/);
});
