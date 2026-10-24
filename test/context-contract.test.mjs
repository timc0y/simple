import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assembleContext } from "../skills/simple/scripts/context.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "simple context "));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, ".git"));
  mkdirSync(join(root, "simple"));
  const operator = join(root, "operator.md");
  return { root, operator, read: (maxChars) => assembleContext({ cwd: root, env: { SIMPLE_OPERATOR_FILE: operator }, maxChars }) };
}

test("attention fields stay on physical lines and a blank remains disabled", (t) => {
  const f = fixture(t);
  for (const eol of ["\n", "\r\n", "\r"]) {
    for (const next of ["## Guard", "Keep replies brief.", "Morgan", "- git push"]) {
      writeFileSync(f.operator, `# Operator${eol}- Attention name:   ${eol}${next}`);
      assert.doesNotMatch(f.read().text, /Optional attention marker/);
    }
    writeFileSync(f.operator, `# Operator${eol}- Attention name: Morgan${eol}## Guard`);
    assert.match(f.read().text, /begin with "Morgan,"/);
  }
});

test("attention supports Unicode names but rejects ambiguity and control characters", (t) => {
  const f = fixture(t);
  for (const name of ["Morgan", "Zoë", "李", "Mary-Jane", "O’Neill"]) {
    writeFileSync(f.operator, `Attention name: ${name}`);
    assert.ok(f.read().text.includes(`begin with "${name},"`));
  }
  for (const field of ["Attention name: A\nAttention name: B", "Attention name:", "Attention name: A<z>",
    'Attention name: A"B', "Attention name: A\\B", "Attention name: A\u202eB", "Attention name: A\0B",
    "Attention name: " + "X".repeat(49), "Attention name: A\u2028B"]) {
    writeFileSync(f.operator, field);
    assert.doesNotMatch(f.read().text, /Optional attention marker/);
  }
});

test("hashes identify raw bytes, not trimmed text", (t) => {
  const f = fixture(t);
  const path = join(f.root, "SIMPLE.md");
  const hashes = [];
  for (const content of ["facts", " facts \r\n", "\ufefffacts\n"]) {
    writeFileSync(path, content);
    const raw = readFileSync(path);
    const source = f.read().sources[0];
    assert.equal(source.sha256, createHash("sha256").update(raw).digest("hex"));
    assert.equal(source.bytes, raw.length);
    hashes.push(source.sha256);
  }
  assert.equal(new Set(hashes).size, 3);
});

test("generated budgets bound all output and preserve omission accounting", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.root, "SIMPLE.md"), "😀 repository fact ".repeat(700));
  writeFileSync(join(f.root, "simple", "round.md"), "round obligation ".repeat(700));
  writeFileSync(f.operator, "Attention name: Zoë\n" + "preference ".repeat(700));
  for (let budget = 0; budget <= 16000; budget += 137) {
    const result = f.read(budget);
    assert.ok(result.text.length <= budget, `budget ${budget}`);
    for (const source of result.sources) {
      assert.equal(source.bytes, readFileSync(source.path).length);
      const full = readFileSync(source.path, "utf8").trim();
      assert.equal(source.deliveredCharacters + source.omittedCharacters, full.length);
      if (source.complete) assert.equal(source.omittedCharacters, 0);
      assert.ok(source.deliveredCharacters <= 6000);
    }
    assert.equal(result.complete, false);
    assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/u.test(result.text));
  }
});

test("partial notices do not discard a readable prefix", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.root, "SIMPLE.md"), "fact ".repeat(1000));
  const result = f.read(1000);
  assert.match(result.text, /Repository-specific Simple context/);
  assert.match(result.text, /Partial profile context/);
  assert.equal(result.sources[0].status, "partial");
});

test("one unavailable source does not erase another, including path spaces", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.root, "SIMPLE.md"), "readable profile");
  mkdirSync(f.operator);
  const result = f.read();
  assert.match(result.text, /readable profile/);
  assert.equal(result.sources.find((source) => source.kind === "operator").status, "unavailable");
  assert.equal(result.complete, false);
});

test("invalid budgets are rejected, not silently interpreted as unlimited", () => {
  for (const maxChars of [NaN, Infinity, -Infinity, -1, 0.5, "12", null, 2 ** 53]) {
    assert.throws(() => assembleContext({ maxChars }), /finite nonnegative safe integer/);
  }
});

test("the regression case distinguishes the previous cross-line parser", (t) => {
  const f = fixture(t);
  const input = "Attention name:\n## Guard";
  const previous = input.match(/^\s*(?:-\s*)?Attention name:\s*([^\r\n]*)$/mi);
  assert.equal(previous[1], "## Guard", "the negative control must reproduce the original bug");
  writeFileSync(f.operator, input);
  assert.doesNotMatch(f.read().text, /Optional attention marker/);
});
