import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expectedGrades, validateGrades } from "../evals/grading.mjs";

const [passId, failId] = expectedGrades("", "writing", "calibration").ids;
const ids = [passId, "ce72bc", failId];
const controls = { [passId]: true, [failId]: false };
const grade = (id, passed) => ({ id, passed, blocker: !passed,
  scores: { readability: 4, actionability: 4, completeness: 4, concision: 4 }, reason: "Checked the material conditions." });
const response = () => ({ grades: [grade(ids[0], true), grade(ids[1], false), grade(ids[2], false)] });

test("grader controls use returned verdicts rather than a claimed self-test", () => {
  assert.deepEqual(validateGrades(response(), ids, controls), []);
  const bad = response();
  bad.selfTest = { passReferencePassed: true, failReferenceRejected: true };
  bad.grades[2].passed = true;
  assert.match(validateGrades(bad, ids, controls).join("\n"), /reference verdict is wrong/);
  bad.grades[2].passed = false;
  bad.grades[0].passed = false;
  assert.match(validateGrades(bad, ids, controls).join("\n"), /reference verdict is wrong/);
  assert.notDeepEqual(validateGrades({ selfTest: bad.selfTest }, ids, controls), []);
});

test("grader responses need every anonymous ID exactly once", () => {
  const good = response();
  good.grades.reverse();
  assert.deepEqual(validateGrades(good, ids, controls), []);
  for (const grades of [good.grades.slice(1), [...good.grades, good.grades[0]],
    good.grades.map((g, i) => i === 1 ? { ...g, id: "invented" } : g)]) {
    assert.notDeepEqual(validateGrades({ grades }, ids, controls), []);
  }
});

test("grader verdicts are Boolean and scores are integers in range", () => {
  for (const [field, value] of [["passed", "false"], ["passed", 1], ["blocker", null], ["reason", " "]]) {
    const bad = response();
    bad.grades[1][field] = value;
    assert.notDeepEqual(validateGrades(bad, ids, controls), [], `${field} = ${value}`);
  }
  for (const value of [undefined, null, "4", 2.5, 0, 6]) {
    const bad = response();
    bad.grades[1].scores.completeness = value;
    assert.notDeepEqual(validateGrades(bad, ids, controls), [], `score = ${value}`);
  }
});

test("invalid control declarations and malformed grades cannot validate a run", () => {
  for (const control of [{}, { [passId]: true }, { [passId]: true, [failId]: true },
    { [passId]: true, invented: false }, { ...controls, ce72bc: true }]) {
    assert.notDeepEqual(validateGrades(response(), ids, control), []);
  }
  for (const value of [null, {}, { grades: null }, { grades: [null] }]) {
    assert.notDeepEqual(validateGrades(value, ids, controls), []);
  }
  assert.notDeepEqual(validateGrades(response(), [...ids, ids[0]], controls), []);
});

test("the grader validator CLI rejects a wrong control through a symlink", () => {
  const directory = mkdtempSync(join(tmpdir(), "simple-grade-validator-"));
  try {
    const script = fileURLToPath(new URL("../evals/grading.mjs", import.meta.url));
    const alias = join(directory, "validator.mjs");
    mkdirSync(join(directory, "grades"));
    const expected = join(directory, "grades/writing.expected.json");
    const output = join(directory, "grades/writing.json");
    writeFileSync(join(directory, "mapping.tsv"), "ce72bc\t1\twriting\tmodel\tcandidate\n");
    symlinkSync(script, alias);
    writeFileSync(expected, JSON.stringify(expectedGrades(directory, "writing")));
    writeFileSync(output, JSON.stringify(response()));
    assert.equal(spawnSync(process.execPath, [alias, "validate", directory, "writing"]).status, 0);
    const bad = response();
    bad.grades[2].passed = true;
    writeFileSync(output, JSON.stringify(bad));
    const result = spawnSync(process.execPath, [alias, "validate", directory, "writing"], { encoding: "utf8" });
    assert.equal(result.status, 1, result.error?.message || result.stderr);
    assert.match(result.stderr, /reference verdict is wrong/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
