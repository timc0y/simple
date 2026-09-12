#!/usr/bin/env python3
"""Preservation check for a slimmed skill: the preservation adapter's six cases and
two repeats, with "previous" taken from a named commit and "candidate" from the
working tree, and no short-control condition.

  BASELINE_COMMIT=c28f3b7 python3 evals/slimming/run.py freeze <record-dir>
  READY=1 python3 evals/slimming/run.py measure <record-dir>
"""
from __future__ import annotations

from pathlib import Path
import hashlib
import importlib.util
import os
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
RECORD = Path(sys.argv[2]).resolve()
spec = importlib.util.spec_from_file_location("preservation_adapter", ROOT / "evals/preservation/run.py")
pres = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pres)

pres.RECORD = RECORD
pres.OLD_RECORD = RECORD / "baseline-source"
pres.CONDITIONS = ("previous", "candidate")


def cell_id(case: str, condition: str, repeat: int | None = None) -> str:
    repeat = pres.base.CURRENT_REPEAT if repeat is None else repeat
    return hashlib.sha256(f"slimming-v1|{case}|{condition}|{repeat}|{pres.MODEL}|{pres.REASONING}".encode()).hexdigest()[:16]


pres.cell_id = cell_id

if sys.argv[1] == "freeze":
    if (RECORD / "manifest.json").exists():
        raise RuntimeError("already frozen")
    baseline_commit = os.environ["BASELINE_COMMIT"]
    source = pres.OLD_RECORD / "frozen"
    if source.exists():
        shutil.rmtree(source)
    source.mkdir(parents=True)
    tar = subprocess.run(["git", "-C", str(ROOT), "archive", baseline_commit, "skills/simple"], check=True, capture_output=True).stdout
    subprocess.run(["tar", "-x", "-C", str(source)], input=tar, check=True)
    (source / "skills/simple").rename(source / "candidate-skill")
    shutil.rmtree(source / "skills")
    (pres.OLD_RECORD / "BASELINE_COMMIT").write_text(
        subprocess.run(["git", "-C", str(ROOT), "rev-parse", baseline_commit], check=True, capture_output=True, text=True).stdout)
    os.environ["FINAL_FREEZE"] = "1"
    pres.preregister()
elif sys.argv[1] == "measure":
    pres.measure()
    print("measured")
else:
    raise SystemExit("usage: run.py freeze|measure <record-dir>")
