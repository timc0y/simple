import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const readme = readFileSync("README.md", "utf8");
assert.match(readme, /docs\/runbooks\/release\.md/);
assert.equal(existsSync("docs/old-cutover.md"), false);
assert.equal(existsSync("docs/plans/device-proof.md"), true);
assert.equal(existsSync("docs/decisions/0001-local-releases.md"), true);
