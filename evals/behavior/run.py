#!/usr/bin/env python3
"""Private, sequential behavior evaluation runner."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SUITE = ROOT / "evals" / "behavior"
RECORD = ROOT / ".local" / "behavior-eval-2026-09-05"
MODEL = "gpt-5.6-luna"
REASONING = "medium"
CONDITIONS = ("none", "current-a", "current-b", "candidate")
CASES = ("correction-preserves", "fallback-selection", "uncertain-write", "reuse-reference", "easy-edit")
BASELINE = "eb9a82f"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def cell_id(case: str, condition: str) -> str:
    return hashlib.sha256(f"2026-09-05|{case}|{condition}|{MODEL}|medium|behavior-v1".encode()).hexdigest()[:16]


def cell_order() -> list[tuple[str, str]]:
    return [(case, CONDITIONS[(index + offset) % len(CONDITIONS)])
            for index, case in enumerate(CASES) for offset in range(len(CONDITIONS))]


def copytree(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, symlinks=True)


def profile(workspace: Path) -> str:
    denied = [ROOT, Path.home() / ".agents/skills", Path.home() / ".codex/skills", Path.home() / ".codex/plugins"]
    rules = ["(version 1)", "(allow default)"]
    rules += [f'(deny file-read* (subpath "{p}"))' for p in denied]
    rules += [f'(allow file-read-metadata (subpath "{ROOT}"))']
    rules += [f'(deny file-write* (subpath "{ROOT}"))']
    rules += [f'(allow file-read* (subpath "{workspace}"))', f'(allow file-write* (subpath "{workspace}"))']
    return " ".join(rules)


def run_process(args: list[str], cwd: Path, timeout: int, sandbox: bool = False) -> tuple[int, str, str, int]:
    command = args
    if sandbox:
        command = ["sandbox-exec", "-p", profile(cwd), *args]
    started = time.monotonic()
    try:
        result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, timeout=timeout)
        return result.returncode, result.stdout, result.stderr, round((time.monotonic() - started) * 1000)
    except subprocess.TimeoutExpired as exc:
        return 124, (exc.stdout.decode(errors="replace") if isinstance(exc.stdout, bytes) else exc.stdout or ""), (exc.stderr.decode(errors="replace") if isinstance(exc.stderr, bytes) else exc.stderr or "timeout"), round((time.monotonic() - started) * 1000)


def codex_args(prompt: str, resume: str | None = None, ephemeral: bool = True) -> list[str]:
    base = ["codex", "exec"] + (["resume", resume] if resume else [])
    options = ["--ignore-user-config", "--ignore-rules", "--disable", "plugins", "--disable", "remote_plugin",
                   "--disable", "apps", "--disable", "hooks", "--disable", "multi_agent", "--disable", "skill_search",
                   "--disable", "skill_mcp_dependency_install", "--skip-git-repo-check",
                   "--dangerously-bypass-approvals-and-sandbox", "--model", MODEL, "--json", "-c", "model_reasoning_effort=medium"]
    if ephemeral: options.insert(options.index("--skip-git-repo-check"), "--ephemeral")
    return base + options + [prompt]


def answer(events: str) -> str:
    found = []
    for line in events.splitlines():
        try:
            item = json.loads(line)
            if item.get("type") == "item.completed" and item.get("item", {}).get("type") == "agent_message":
                found.append(item["item"].get("text", ""))
        except json.JSONDecodeError:
            continue
    if not found or not found[-1].strip():
        raise RuntimeError("solver produced no final agent message")
    return found[-1]


def metadata(events: str, latency: int, returncode: int, thread: str | None) -> dict:
    turns = usage = 0
    toolcalls = 0
    revision = MODEL
    for line in events.splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("type") == "thread.started":
            thread = obj.get("thread_id") or obj.get("threadId") or thread
        if obj.get("type") == "turn.completed":
            turns += 1
            u = obj.get("usage") or {}
            usage += (u.get("total_tokens") or u.get("input_tokens", 0) + u.get("output_tokens", 0))
            revision = obj.get("model", revision)
        if obj.get("type") == "item.completed" and obj.get("item", {}).get("type") in {"function_call", "command_execution", "mcp_tool_call"}:
            toolcalls += 1
    return {"returncode": returncode, "threadid": thread, "model_revision": revision, "turns": turns,
            "tokens": usage, "latency_ms": latency, "toolcalls": toolcalls}


def canary() -> None:
    probe = RECORD / "canary-workspace"
    probe.mkdir(parents=True, exist_ok=True)
    code, _, _, _ = run_process(["cat", str(ROOT / "evals" / "README.md")], probe, 10, True)
    if code == 0:
        raise RuntimeError("sandbox canary failed: repository/grading files are readable")
    (probe / "canary.txt").write_text("ok\n")


def selftest() -> None:
    if sys.platform != "darwin":
        raise RuntimeError("behavior runner requires macOS sandbox-exec")
    if subprocess.run(["git", "-C", str(ROOT), "cat-file", "-e", f"{BASELINE}:skills/simple/SKILL.md"], capture_output=True).returncode:
        raise RuntimeError(f"missing baseline {BASELINE}:skills/simple")
    for case in CASES:
        d = SUITE / "cases" / case
        for required in ("fixture", "prompt.md", "verifier.mjs"):
            if not (d / required).exists():
                raise RuntimeError(f"missing {d / required}")
        if not (d / "prompt.md").is_file() or not (d / "verifier.mjs").is_file():
            raise RuntimeError(f"invalid case files in {d}")
        if case == "correction-preserves" and not (d / "correction.md").is_file():
            raise RuntimeError("correction case needs correction.md")
        if case == "correction-preserves" and not (d / "initial-verifier.mjs").is_file():
            raise RuntimeError("correction case needs initial-verifier.mjs")
    RECORD.mkdir(parents=True, exist_ok=True)
    canary()


def preregister() -> None:
    selftest()
    if (RECORD / "manifest.json").exists(): raise RuntimeError("manifest already frozen; preserve this run")
    frozen = RECORD / "frozen"; frozen.mkdir(parents=True, exist_ok=True)
    copytree(ROOT / "skills/simple", frozen / "candidate-skill")
    baseline_dir = frozen / "baseline-skill"; baseline_dir.mkdir(parents=True, exist_ok=True)
    archive = subprocess.run(["git", "-C", str(ROOT), "archive", BASELINE, "skills/simple"], capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", str(baseline_dir), "--strip-components=2"], input=archive, check=True)
    hashes = {}
    for path in sorted(SUITE.rglob("*")):
        if path.is_file() and "__pycache__" not in path.parts: hashes[str(path.relative_to(SUITE))] = hashlib.sha256(path.read_bytes()).hexdigest()
    manifest = {"created_at": now(), "model": MODEL, "reasoning": REASONING, "conditions": CONDITIONS,
                "cases": CASES, "baseline": BASELINE, "candidate": "working-tree skills/simple",
                "case_hashes": hashes,
                "skill_hashes": {str(p.relative_to(frozen)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(frozen.rglob("*")) if p.is_file()},
                "cells": [{"id": cell_id(c, k), "case": c, "condition": k} for c, k in cell_order()]}
    RECORD.joinpath("manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    RECORD.joinpath("freeze.sha256").write_text(hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest() + "\n")
    print(f"preregistered {len(manifest['cells'])} cells")


def verify_freeze() -> None:
    manifest = json.loads((RECORD / "manifest.json").read_text())
    for relative, expected in manifest["skill_hashes"].items():
        path = RECORD / "frozen" / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise RuntimeError(f"frozen skill changed: {relative}")
    for relative, expected in manifest["case_hashes"].items():
        path = SUITE / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise RuntimeError(f"frozen case changed: {relative}")
    if not (RECORD / "frozen/candidate-skill/SKILL.md").is_file() or not (RECORD / "frozen/baseline-skill/SKILL.md").is_file():
        raise RuntimeError("frozen skill snapshots are missing")


def preflight() -> None:
    selftest()
    workspace = RECORD / "preflight"; workspace.mkdir(parents=True, exist_ok=True)
    (workspace / "package.json").write_text('{"type":"module","scripts":{"test":"node --test smoke.test.mjs"}}\n')
    (workspace / "smoke.test.mjs").write_text("import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.ok(readFileSync('preflight.txt','utf8').startsWith('first'));\n")
    code, first, err, latency = run_process(codex_args("Write first followed by a newline into preflight.txt. Run npm test without changing the test. Reply PREFLIGHT.", ephemeral=False), workspace, 120, True)
    thread = next((json.loads(line).get("thread_id") for line in first.splitlines() if line.startswith('{') and json.loads(line).get("type") == "thread.started"), None)
    second_code, second, second_err, second_latency = run_process(codex_args("Append second followed by a newline to preflight.txt, preserving its existing content. Run npm test without changing the test. Reply RESUMED.", thread, ephemeral=False), workspace, 120, True) if thread else (125, "", "no thread id", 0)
    (RECORD / "preflight.json").write_text(json.dumps({"excluded_from_cells": True, "first_code": code, "second_code": second_code,
        "threadid": thread, "latency_ms": latency + second_latency, "stdout": first + "\n" + second, "stderr": err + "\n" + second_err}, indent=2) + "\n")
    if code != 0 or second_code != 0 or "RESUMED" not in second or not (workspace / "preflight.txt").exists() or (workspace / "preflight.txt").read_text() != "first\nsecond\n":
        raise RuntimeError("exec/resume preflight failed")


def skill_into(condition: str, workspace: Path) -> None:
    target = workspace / ".agents" / "skills" / "simple"
    target.parent.mkdir(parents=True, exist_ok=True)
    if condition == "none":
        return
    if condition in ("current-a", "current-b"):
        copytree(RECORD / "frozen/baseline-skill", target)
    else:
        copytree(RECORD / "frozen/candidate-skill", target)


def run_cell(case: str, condition: str) -> None:
    cid = cell_id(case, condition)
    cdir, ws = SUITE / "cases" / case, RECORD / "workspaces" / cid
    cell = RECORD / "cells" / cid
    cell.mkdir(parents=True, exist_ok=True)
    status = cell / "status.json"
    if status.exists() and json.loads(status.read_text()).get("status") in {"success", "completed_verifier_failed"}:
        return
    verify_freeze()
    copytree(cdir / "fixture", ws)
    if (cdir / "SIMPLE.md").exists(): shutil.copy2(cdir / "SIMPLE.md", ws / "SIMPLE.md")
    subprocess.run(["git", "init", "-q", str(ws)], check=True)
    subprocess.run(["git", "add", "-f", "."], cwd=ws, check=True)
    subprocess.run(["git", "-c", "user.name=Evaluation", "-c", "user.email=eval@example.invalid", "commit", "-qm", "fixture"], cwd=ws, check=True)
    (ws / "prompt.md").write_text((cdir / "prompt.md").read_text())
    skill_into(condition, ws)
    (RECORD / "snapshots" / cid).mkdir(parents=True, exist_ok=True)
    events, errors = [], []
    prompt = "Read prompt.md and complete the task. Use the fixture files it names."
    if condition != "none":
        prompt += " Read .agents/skills/simple/SKILL.md and every specialist reference that it routes this task to before acting."
    correction = case == "correction-preserves"
    code, turn1_out, turn1_err, latency = run_process(codex_args(prompt, ephemeral=not correction), ws, 300, True)
    events.append(turn1_out); errors.append(turn1_err)
    turn2_out = ""; turn2_err = ""; turn2_code = 0; turn2_latency = 0
    thread = None
    try:
        final = answer(turn1_out)
    except Exception:
        final = ""
    (RECORD / "events").mkdir(parents=True, exist_ok=True); (RECORD / "errors").mkdir(parents=True, exist_ok=True)
    attempt = len(list((RECORD / "events").glob(f"{cid}.*.jsonl")))
    initial = RECORD / "snapshots" / cid / f"initial-{attempt}"
    copytree(ws, initial)
    (RECORD / "events" / f"{cid}.{attempt}.turn1.jsonl").write_text(turn1_out)
    (RECORD / "errors" / f"{cid}.{attempt}.turn1.log").write_text(turn1_err)
    initial_code, initial_out, initial_err = code, turn1_out, turn1_err
    initial_verifier_code = 0
    if correction:
        ivout = RECORD / "verifiers"; ivout.mkdir(parents=True, exist_ok=True)
        initial_verifier_code, ivstdout, ivstderr, _ = run_process(["node", str(cdir / "initial-verifier.mjs"), str(initial), str(ivout / f"{cid}.initial.json")], ROOT, 60)
        (ivout / f"{cid}.initial.stdout").write_text(ivstdout); (ivout / f"{cid}.initial.stderr").write_text(ivstderr)
        try: initial_verifier_passed = json.loads(ivstdout).get("passed") is True
        except (json.JSONDecodeError, AttributeError): initial_verifier_passed = False
    else:
        initial_verifier_passed = True
    if case == "correction-preserves" and thread is None:
        for line in turn1_out.splitlines():
            try:
                obj = json.loads(line)
                if obj.get("type") == "thread.started": thread = obj.get("thread_id") or obj.get("threadId")
            except json.JSONDecodeError: pass
        if thread:
            turn2_code, turn2_out, turn2_err, turn2_latency = run_process(codex_args((cdir / "correction.md").read_text(), thread, ephemeral=False), ws, 300, True)
            code, latency = turn2_code, latency + turn2_latency
            events.append(turn2_out); errors.append(turn2_err)
            (RECORD / "events" / f"{cid}.{attempt}.turn2.jsonl").write_text(turn2_out)
            (RECORD / "errors" / f"{cid}.{attempt}.turn2.log").write_text(turn2_err)
            try: final = answer(turn2_out)
            except Exception: final = ""
    out, err = "\n".join(events), "\n".join(errors)
    (RECORD / "raw").mkdir(parents=True, exist_ok=True)
    (RECORD / "events" / f"{cid}.{attempt}.jsonl").write_text(out)
    (RECORD / "errors" / f"{cid}.{attempt}.log").write_text(err)
    (RECORD / "events" / f"{cid}.{attempt}.turn1.jsonl").write_text(turn1_out)
    if correction: (RECORD / "events" / f"{cid}.{attempt}.turn2.jsonl").write_text(turn2_out)
    (RECORD / "metadata").mkdir(parents=True, exist_ok=True)
    (RECORD / "metadata" / f"{cid}.turn1.json").write_text(json.dumps(metadata(turn1_out, latency - turn2_latency, initial_code, thread), indent=2) + "\n")
    if correction: (RECORD / "metadata" / f"{cid}.turn2.json").write_text(json.dumps(metadata(turn2_out, turn2_latency, turn2_code, thread), indent=2) + "\n")
    (RECORD / "raw" / f"{cid}.md").write_text(final)
    finaldir = RECORD / "snapshots" / cid / f"final-{attempt}"; copytree(ws, finaldir)
    diff_initial = subprocess.run(["diff", "-ruN", "--exclude=.git", "--exclude=.agents", "--exclude=prompt.md", str(cdir / "fixture"), str(initial)], text=True, capture_output=True).stdout
    diff = subprocess.run(["diff", "-ruN", "--exclude=.git", "--exclude=.agents", "--exclude=prompt.md", str(cdir / "fixture"), str(finaldir)], text=True, capture_output=True).stdout
    (RECORD / "diffs").mkdir(parents=True, exist_ok=True); (RECORD / "diffs" / f"{cid}.diff").write_text(diff)
    (RECORD / "diffs" / f"{cid}.initial.diff").write_text(diff_initial)
    verdict = RECORD / "verifiers"; verdict.mkdir(parents=True, exist_ok=True)
    vcode, vout, verr, _ = run_process(["node", str(cdir / "verifier.mjs"), str(finaldir), str(verdict / f"{cid}.json")], ROOT, 60)
    (RECORD / "verifiers" / f"{cid}.stdout").write_text(vout); (RECORD / "verifiers" / f"{cid}.stderr").write_text(verr)
    meta = metadata(out, latency, code, thread)
    try: verifier_passed = json.loads(vout).get("passed") is True
    except (json.JSONDecodeError, AttributeError): verifier_passed = False
    try: first_message = answer(turn1_out)
    except Exception: first_message = ""
    solver_complete = initial_code == 0 and bool(first_message.strip())
    if correction: solver_complete = solver_complete and bool(thread) and turn2_code == 0 and bool(final.strip()) and bool(turn2_out.strip())
    meta.update({"initial_returncode": initial_code, "initial_verifier_code": initial_verifier_code,
                 "initial_verifier_passed": initial_verifier_passed,
                 "status": "success" if solver_complete and vcode == 0 and verifier_passed and initial_verifier_code == 0 and initial_verifier_passed else ("completed_verifier_failed" if solver_complete else "invalid_harness"),
                 "verifier_code": vcode, "finished_at": now()})
    status.write_text(json.dumps(meta, indent=2) + "\n")
    print(f"{case}/{condition}: {meta['status']}", flush=True)


def measure() -> None:
    selftest()
    if os.environ.get("READY") != "1": raise RuntimeError("set READY=1 only after fixtures, selftests, and preregistration are frozen")
    manifest = RECORD / "manifest.json"
    if not manifest.exists(): raise RuntimeError("run preregister first")
    verify_freeze()
    if not (RECORD / "preflight.json").exists(): preflight()
    for cell in json.loads((RECORD / "manifest.json").read_text())["cells"]:
        run_cell(cell["case"], cell["condition"])
        status = json.loads((RECORD / "cells" / cell["id"] / "status.json").read_text())
        if status["status"] == "invalid_harness":
            raise RuntimeError(f"invalid cell {cell['id']}; inspect before retrying")
    mapping = RECORD / "mapping.tsv"
    mapping.write_text("\n".join(
        f"{cell_id(c, k)}\t1\t{c}\t{MODEL}\t{k}" for c, k in cell_order()) + "\n")
    rows = []
    for case, condition in cell_order():
        record = json.loads((RECORD / "cells" / cell_id(case, condition) / "status.json").read_text())
        ok = record.get("status") == "success"
        rows.append(f"1\t{case}\t{MODEL}\t{condition}\t{str(ok).lower()}")
    (RECORD / "results.tsv").write_text("run\tcase\tmodel\tcondition\tstrict\n" + "\n".join(rows) + "\n")
    (RECORD / "models.tsv").write_text(f"key\tname\trevision\treasoning\tharness\n{MODEL}\t{MODEL}\tnot reported; requested {MODEL}\t{REASONING}\tisolated executable behavior evaluation\n")
    subprocess.run(["node", str(ROOT / "evals" / "normalize-results.mjs"), str(RECORD), BASELINE,
                    "isolated sequential Codex Luna behavior evaluation", now()], check=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("selftest", "preregister", "preflight", "measure", "resume"), nargs="?", default="selftest")
    args = parser.parse_args()
    {"selftest": selftest, "preregister": preregister, "preflight": preflight, "measure": measure, "resume": measure}[args.command]()


if __name__ == "__main__":
    main()
