#!/usr/bin/env python3
"""Run a bounded workflow screen through the existing isolated Luna harness."""
import argparse
import hashlib
import importlib.util
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location("behavior", ROOT / "evals/behavior/run.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["freeze", "measure"])
    parser.add_argument("--record", type=Path, required=True)
    parser.add_argument("--previous", type=Path)
    args = parser.parse_args()
    record = args.record.resolve()
    base.RECORD = record
    base.SUITE = record / "frozen/cases"
    base.CASES = ("easy-edit", "shared-failure", "migration-decision")
    base.CONDITIONS = ("none", "previous", "candidate")
    base.cell_id = lambda case, condition: hashlib.sha256(
        f"personal-fit-v1|{case}|{condition}|{base.MODEL}|{base.REASONING}".encode()
    ).hexdigest()[:16]

    def skill_into(condition, workspace):
        if condition != "none":
            target = workspace / ".agents/skills/simple"
            target.parent.mkdir(parents=True, exist_ok=True)
            base.copytree(record / f"frozen/{condition}-skill", target)

    base.skill_into = skill_into

    def verify_freeze():
        manifest = json.loads((record / "manifest.json").read_text())
        for path, expected in manifest["hashes"].items():
            if digest(record / path) != expected:
                raise RuntimeError(f"frozen input changed: {path}")
        if digest(ROOT / "evals/behavior/run.py") != manifest["base_runner_sha256"]:
            raise RuntimeError("base runner changed after freeze")
        if digest(Path(__file__)) != manifest["adapter_sha256"]:
            raise RuntimeError("adapter changed after freeze")

    base.verify_freeze = verify_freeze
    if args.command == "freeze":
        if (record / "manifest.json").exists():
            raise RuntimeError("record already frozen; use a new record directory")
        if not args.previous or not (args.previous / "SKILL.md").is_file():
            raise RuntimeError("freeze needs --previous pointing to the prior full skill")
        record.mkdir(parents=True, exist_ok=True)
        for case in base.CASES:
            source = Path(__file__).resolve().parent / "cases" / case
            result = base.run_process(["node", str(source / "selftest.mjs")], source, 60)
            if result[0]:
                raise RuntimeError(f"verifier selftest failed: {case}: {result[1]} {result[2]}")
            shutil.copytree(source, base.SUITE / "cases" / case)
        shutil.copytree(args.previous, record / "frozen/previous-skill")
        shutil.copytree(ROOT / "skills/simple", record / "frozen/candidate-skill")
        shutil.copy2(ROOT / "evals/behavior/run.py", record / "frozen/behavior-run.py")
        shutil.copy2(__file__, record / "frozen/workflow-run.py")
        hashes = {str(p.relative_to(record)): digest(p) for p in sorted((record / "frozen").rglob("*")) if p.is_file()}
        manifest = {"created_at": base.now(), "model": base.MODEL, "reasoning": base.REASONING,
                    "conditions": base.CONDITIONS, "cases": base.CASES, "repeats": 1,
                    "purpose": "bounded execution and preservation screen; no superiority claim",
                    "hashes": hashes, "base_runner_sha256": digest(ROOT / "evals/behavior/run.py"),
                    "adapter_sha256": digest(Path(__file__)),
                    "cells": [{"id": base.cell_id(c, k), "case": c, "condition": k} for c, k in base.cell_order()]}
        (record / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        print("Frozen nine cells. Run measure with READY=1 after reviewing the manifest.")
    else:
        base.measure()
        path = record / "results.json"
        records = json.loads(path.read_text())
        manifest = json.loads((record / "manifest.json").read_text())
        for result in records:
            condition = result["condition"]
            selected = {k: v for k, v in manifest["hashes"].items() if k.startswith(f"frozen/{condition}-skill/")}
            result["skillCommit"] = "none" if condition == "none" else "snapshot-" + hashlib.sha256(
                json.dumps(selected, sort_keys=True).encode()).hexdigest()
        path.write_text(json.dumps(records, indent=2) + "\n")


if __name__ == "__main__":
    main()
