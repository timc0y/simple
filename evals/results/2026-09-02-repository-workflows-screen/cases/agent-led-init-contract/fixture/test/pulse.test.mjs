import assert from "node:assert/strict";
import test from "node:test";
import { pulse } from "../src/pulse.mjs";

test("pulse returns the current response", () => {
  assert.equal(pulse(), "rook-17");
});
