#!/usr/bin/env python3
"""Repeated preservation evaluation adapter around the frozen behavior runner."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SUITE = ROOT / "evals" / "preservation"
RECORD = ROOT / ".local" / "preservation-eval-2026-09-06"
OLD_RECORD = ROOT / ".local" / "behavior-eval-2026-09-05"
OLD_RUNNER = ROOT / "evals" / "behavior" / "run.py"
MODEL = "gpt-5.6-luna"
REASONING = "medium"
CONDITIONS = ("previous", "candidate", "short")
CASES = ("correction-preserves", "fallback-selection", "reuse-package", "reuse-local", "reuse-direct", "writing-context")
REPEATS = 2
SHORT_CONTROL = "Use repository facts to choose the smallest change that fully satisfies the request. Reuse existing implementations where they fit, preserve unaffected requirements, remove displaced code, and verify the result."

spec = importlib.util.spec_from_file_location("frozen_behavior_runner", OLD_RUNNER)
if spec is None or spec.loader is None:
    raise RuntimeError(f"cannot load {OLD_RUNNER}")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def cell_id(case: str, condition: str, repeat: int | None = None) -> str:
    repeat = base.CURRENT_REPEAT if repeat is None else repeat
    return hashlib.sha256(f"2026-09-06|{case}|{condition}|{repeat}|{MODEL}|{REASONING}|preservation-v1".encode()).hexdigest()[:16]


def cell_order() -> list[tuple[str, str, int]]:
    cells = []
    for repeat in range(1, REPEATS + 1):
        for index, case in enumerate(CASES):
            rotation = (index + repeat - 1) % len(CONDITIONS)
            cells.extend((case, CONDITIONS[(rotation + offset) % len(CONDITIONS)], repeat)
                         for offset in range(len(CONDITIONS)))
    return cells


def copytree(src: Path, dst: Path, ignore=None) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, symlinks=True, ignore=ignore)


def selftest() -> None:
    base.SUITE = SUITE
    base.RECORD = RECORD
    base.CASES = CASES
    base.CONDITIONS = CONDITIONS
    base.selftest = selftest
    base.skill_into = skill_into
    base.verify_freeze = verify_freeze
    if not OLD_RUNNER.is_file():
        raise RuntimeError(f"missing imported runner: {OLD_RUNNER}")
    previous = OLD_RECORD / "frozen" / "candidate-skill"
    if not (previous / "SKILL.md").is_file():
        raise RuntimeError(f"missing previous skill snapshot: {previous}")
    for case in CASES:
        directory = SUITE / "cases" / case
        for required in ("fixture", "prompt.md", "verifier.mjs", "graders/criteria.md", "graders/references/pass.md", "graders/references/fail.md"):
            if not (directory / required).exists():
                raise RuntimeError(f"missing {directory / required}")
        if case == "correction-preserves" and not (directory / "correction.md").is_file():
            raise RuntimeError("correction case needs correction.md")
        if case == "correction-preserves" and not (directory / "initial-verifier.mjs").is_file():
            raise RuntimeError("correction case needs initial-verifier.mjs")
        case_selftest = directory / "selftest.mjs"
        if case_selftest.is_file():
            result = subprocess.run(["node", str(case_selftest)], cwd=directory, capture_output=True, text=True)
            if result.returncode:
                raise RuntimeError(f"case selftest failed: {case}: {result.stdout}{result.stderr}")
    root_selftest = subprocess.run(["python3", str(ROOT / "evals/behavior/selftest.py")], capture_output=True, text=True)
    if root_selftest.returncode:
        raise RuntimeError(f"behavior selftest failed: {root_selftest.stdout}{root_selftest.stderr}")
    RECORD.mkdir(parents=True, exist_ok=True)
    base.canary()


def preregister() -> None:
    selftest()
    if os.environ.get("FINAL_FREEZE") != "1":
        raise RuntimeError("set FINAL_FREEZE=1 only after root confirms FINAL FREEZE")
    if (RECORD / "manifest.json").exists():
        raise RuntimeError("manifest already frozen; preserve this run")
    frozen = RECORD / "frozen"
    frozen.mkdir(parents=True, exist_ok=True)
    copytree(OLD_RECORD / "frozen" / "candidate-skill", frozen / "previous-skill")
    copytree(ROOT / "skills/simple", frozen / "candidate-skill")
    shutil.copy2(OLD_RUNNER, frozen / "behavior-run.py")
    copytree(SUITE, frozen / "cases", ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    previous_manifest = OLD_RECORD / "manifest.json"
    if previous_manifest.is_file():
        shutil.copy2(previous_manifest, frozen / "previous-manifest.json")
    hashes = {}
    for path in sorted(SUITE.rglob("*")):
        if path.is_file() and "__pycache__" not in path.parts:
            hashes[str(path.relative_to(SUITE))] = hashlib.sha256(path.read_bytes()).hexdigest()
    skill_hashes = {str(path.relative_to(frozen)): hashlib.sha256(path.read_bytes()).hexdigest()
                    for path in sorted(frozen.rglob("*")) if path.is_file()}
    candidate_skill_sha256 = hashlib.sha256((frozen / "candidate-skill" / "SKILL.md").read_bytes()).hexdigest()
    previous_skill_sha256 = hashlib.sha256((frozen / "previous-skill" / "SKILL.md").read_bytes()).hexdigest()
    manifest = {"created_at": now(), "model": MODEL, "reasoning": REASONING,
                "conditions": CONDITIONS, "cases": CASES, "repeats": REPEATS,
                "short_control": SHORT_CONTROL, "case_hashes": hashes,
                "skill_hashes": skill_hashes,
                "candidate_skill_sha256": candidate_skill_sha256,
                "previous_skill_sha256": previous_skill_sha256,
                "runner_sha256": hashlib.sha256(OLD_RUNNER.read_bytes()).hexdigest(),
                "cells": [{"id": cell_id(c, k, r), "case": c, "condition": k, "repeat": r}
                          for c, k, r in cell_order()]}
    (RECORD / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (RECORD / "freeze.sha256").write_text(hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest() + "\n")
    print(f"preregistered {len(manifest['cells'])} cells")


def verify_freeze() -> None:
    manifest = json.loads((RECORD / "manifest.json").read_text())
    if hashlib.sha256(OLD_RUNNER.read_bytes()).hexdigest() != manifest["runner_sha256"]:
        raise RuntimeError("imported behavior runner changed after freeze")
    for relative, expected in manifest["skill_hashes"].items():
        path = RECORD / "frozen" / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise RuntimeError(f"frozen source changed: {relative}")
    for relative, expected in manifest["case_hashes"].items():
        path = SUITE / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise RuntimeError(f"frozen case changed: {relative}")


def skill_into(condition: str, workspace: Path) -> None:
    target = workspace / ".agents" / "skills" / "simple"
    target.parent.mkdir(parents=True, exist_ok=True)
    if condition == "previous":
        copytree(RECORD / "frozen/previous-skill", target)
    elif condition == "candidate":
        copytree(RECORD / "frozen/candidate-skill", target)
    elif condition == "short":
        target.mkdir(parents=True, exist_ok=True)
        (target / "SKILL.md").write_text(SHORT_CONTROL + "\n")
    else:
        raise RuntimeError(f"unknown condition {condition}")


def run_cell(case: str, condition: str, repeat: int) -> None:
    base.CURRENT_REPEAT = repeat
    base.cell_id = lambda c, k: cell_id(c, k, repeat)
    base.run_cell(case, condition)


def archive_invalid(cid: str) -> None:
    """Keep overwritten retry outputs together with the first invalid result."""
    source = RECORD / "cells" / cid
    target = source / "attempt-1"
    target.mkdir(parents=True, exist_ok=True)
    for directory, pattern in ((RECORD / "metadata", f"{cid}*"), (RECORD / "raw", f"{cid}*"),
                               (RECORD / "errors", f"{cid}*")):
        for path in directory.glob(pattern):
            shutil.copy2(path, target / f"{directory.name}-{path.name}")
    status = source / "status.json"
    if status.is_file():
        shutil.copy2(status, target / "status.json")


def measure() -> None:
    selftest()
    if os.environ.get("READY") != "1":
        raise RuntimeError("set READY=1 only after FINAL FREEZE and preregistration")
    if not (RECORD / "manifest.json").is_file():
        raise RuntimeError("run preregister first")
    verify_freeze()
    if not (RECORD / "preflight.json").exists():
        base.preflight()
    for case, condition, repeat in cell_order():
        cid = cell_id(case, condition, repeat)
        status = RECORD / "cells" / cid / "status.json"
        if status.exists() and json.loads(status.read_text()).get("status") in {"success", "completed_verifier_failed", "incomplete"}:
            continue
        run_cell(case, condition, repeat)
        if status.exists() and json.loads(status.read_text()).get("status") == "invalid_harness":
            retry = RECORD / "cells" / cid / "retry.json"
            if not retry.exists():
                archive_invalid(cid)
                retry.write_text(json.dumps({"cause": "incomplete_or_timeout; cause unestablished", "attempt": 2}) + "\n")
                run_cell(case, condition, repeat)
                if status.exists() and json.loads(status.read_text()).get("status") == "invalid_harness":
                    failed = json.loads(status.read_text())
                    failed.update({"status": "incomplete", "failure_review": "incomplete_or_timeout; cause unestablished"})
                    status.write_text(json.dumps(failed, indent=2) + "\n")
    mapping = RECORD / "mapping.tsv"
    mapping.write_text("\n".join(f"{cell_id(c,k,r)}\t{r}\t{c}\t{MODEL}\t{k}" for c,k,r in cell_order()) + "\n")
    rows = []
    for case, condition, repeat in cell_order():
        record = json.loads((RECORD / "cells" / cell_id(case, condition, repeat) / "status.json").read_text())
        rows.append(f"{repeat}\t{case}\t{MODEL}\t{condition}\t{str(record.get('status') == 'success').lower()}")
    (RECORD / "results.tsv").write_text("run\tcase\tmodel\tcondition\tstrict\n" + "\n".join(rows) + "\n")
    (RECORD / "models.tsv").write_text(f"key\tname\trevision\treasoning\tharness\n{MODEL}\t{MODEL}\tnot reported; requested {MODEL}\t{REASONING}\tisolated sequential Codex Luna preservation evaluation\n")
    public = RECORD / "public"
    public.mkdir(exist_ok=True)
    lines = ["id\trun\tcase\tcondition\tstatus\traw_artifact\tverifier_artifact\tdiff_artifact\tfailure_review"]
    for case, condition, repeat in cell_order():
        cid = cell_id(case, condition, repeat)
        status = json.loads((RECORD / "cells" / cid / "status.json").read_text())
        outcome = status.get("status", "missing")
        review = "none" if outcome == "success" else ("review incomplete_or_timeout; cause unestablished" if outcome in {"invalid_harness", "incomplete"} else "review verifier failure")
        lines.append(f"{cid}\t{repeat}\t{case}\t{condition}\t{outcome}\traw/{cid}.md\tverifiers/{cid}.json\tdiffs/{cid}.diff\t{review}")
    (public / "cells.tsv").write_text("\n".join(lines) + "\n")
    manifest = json.loads((RECORD / "manifest.json").read_text())
    skill_commit = "candidate-snapshot-" + manifest["candidate_skill_sha256"]
    subprocess.run(["node", str(ROOT / "evals/normalize-results.mjs"), str(RECORD), skill_commit,
                    "repeated preservation evaluation", now()], check=True)
    normalized = json.loads((RECORD / "results.json").read_text())
    for record in normalized:
        condition = record["condition"]
        record["skillCommit"] = ("candidate-snapshot-" + manifest["candidate_skill_sha256"] if condition == "candidate"
                                  else "previous-snapshot-" + manifest["previous_skill_sha256"] if condition == "previous" else "none")
    (RECORD / "results.json").write_text(json.dumps(normalized, indent=2) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("selftest", "preregister", "preflight", "measure", "resume"), default="selftest", nargs="?")
    command = parser.parse_args().command
    {"selftest": selftest, "preregister": preregister, "preflight": lambda: (selftest(), base.preflight()), "measure": measure, "resume": measure}[command]()


if __name__ == "__main__":
    main()
