import assert from "node:assert/strict";
import test from "node:test";
import { labelTicket } from "../src/label.mjs";

test("ticket labels include the product prefix", () => {
  assert.equal(labelTicket(17), "ER-17");
});
