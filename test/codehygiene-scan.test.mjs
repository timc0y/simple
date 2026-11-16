import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { reviewCandidates, scanCodehygiene } from "../skills/simple/scripts/codehygiene.mjs";

const flags = [1, 2, 3, 4].map((line) => ({ line, kind: "swallowed_error", probability: 0.88, message: "Ignored error" }));

test("review output retains raw flags without treating defaults as established defects", () => {
  const result = reviewCandidates("function check(config = {}) {}", flags.slice(0, 1));
  assert.match(result.candidates[0].observation, /default-value pattern/);
  assert.equal(result.status, "needs-review");
  assert.deepEqual(result.rawFindings, flags.slice(0, 1));
  assert.equal(result.score, undefined);
  assert.equal(result.candidates[0].probability, undefined);
  assert.equal(result.coverage.complete, true);
});

test("coverage exposes truncation, expanded tabs and collapsed Unicode", () => {
  const source = ["\t".repeat(65), "é😀", ...Array(2047).fill("x")].join("\n");
  const result = reviewCandidates(source, []);
  assert.equal(result.coverage.totalLines, 2049);
  assert.equal(result.coverage.encodedLines, 2048);
  assert.equal(result.coverage.unreadLines, 1);
  assert.deepEqual(result.coverage.clippedLines, [1]);
  assert.deepEqual(result.coverage.nonAsciiLines, [2]);
  assert.equal(result.coverage.complete, false);
  assert.equal(reviewCandidates("x\r\ny\n", []).coverage.totalLines, 2);
});

test("changed-line focus preserves omitted flags and deletion-only ranges select nothing", () => {
  const result = reviewCandidates("one\ntwo\nthree\nfour", flags, [[2, 2], [4, 3]]);
  assert.deepEqual(result.candidates.map((flag) => flag.line), [2]);
  assert.equal(result.outsideChangedLines, 3);
  assert.deepEqual(result.rawFindings, flags);
});

test("Git comparison includes staged and unstaged edits, and scans untracked files in full", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "simple codehygiene scan "));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" });
  git("init", "--quiet");
  const file = "sample's file.ts";
  writeFileSync(join(cwd, file), "one\ntwo\nthree\nfour\n");
  git("add", "--", file);
  git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "fixture");
  writeFileSync(join(cwd, file), "one\nchanged two\nthree\nfour\n");
  git("add", "--", file);
  const current = "one\nchanged two\nthree\nchanged four\n";
  writeFileSync(join(cwd, file), current);
  writeFileSync(join(cwd, "new.ts"), "new\nsecond\nthird\nfourth\n");
  const run = (program, args, options) => program === "codehygiene"
    ? { status: 0, stdout: args[0] === "--version" ? "codehygiene 0.4.0\n" : JSON.stringify({ score: 0, squiggles: flags }) }
    : spawnSync(program, args, options);
  const result = scanCodehygiene([file, "new.ts"], { cwd, base: "HEAD", run });
  assert.deepEqual(result.files[0].candidates.map((flag) => flag.line), [2, 4]);
  assert.equal(result.files[0].outsideChangedLines, 2);
  assert.equal(result.files[1].scope, "whole-file");
  assert.equal(readFileSync(join(cwd, file), "utf8"), current);
  assert.throws(() => scanCodehygiene([file], { cwd, base: "missing-ref", run }), /git failed/);
  assert.throws(() => scanCodehygiene([import.meta.filename], { cwd, base: "HEAD", run }), /outside/);
});

test("missing tool and unverified versions fail rather than reporting clean code", () => {
  assert.throws(() => scanCodehygiene(["x.ts"], { run: () => ({ error: new Error("ENOENT") }) }), /ENOENT/);
  assert.throws(() => scanCodehygiene(["x.ts"], { run: () => ({ status: 0, stdout: "codehygiene 1.0.0" }) }), /Expected codehygiene/);
  assert.throws(() => scanCodehygiene([]), /explicit source/);
});
