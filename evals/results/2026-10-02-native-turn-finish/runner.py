#!/usr/bin/env python3
"""Frozen six-call native lifecycle screen; no answer-based retries."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import shlex
import shutil
import signal
import subprocess
import threading
import time

RECORD = Path(__file__).resolve().parent
REPO = RECORD.parents[2]
RUNTIME = Path((RECORD / "runtime-path.txt").read_text().strip())
PROTOCOL = json.loads((RECORD / "registered-protocol.json").read_text())
MATRIX = [tuple(row.split()) for row in PROTOCOL["matrix"]]
INPUTS = RECORD / "inputs"


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value if isinstance(value, str) else json.dumps(value, indent=2) + chr(10))


def now():
    return datetime.now(timezone.utc).isoformat()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def toml(value):
    if isinstance(value, dict):
        return "{" + ",".join(json.dumps(key) + "=" + toml(item) for key, item in value.items()) + "}"
    if isinstance(value, list):
        return "[" + ",".join(toml(item) for item in value) + "]"
    return json.dumps(value)


def file_state(workspace):
    return {str(path.relative_to(workspace)): digest(path)
            for path in workspace.rglob("*") if path.is_file() and ".git" not in path.relative_to(workspace).parts}


def capture(command, cwd):
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True)
    return {"argv": command, "returncode": result.returncode, "stdout": result.stdout, "stderr": result.stderr}


def isolation(cell):
    protected = [
        "(version 1)", "(allow default)",
        '(deny file-read* (literal "[private home redacted]/.codex/hooks.json"))',
        '(deny file-read* (literal "[private home redacted]/.codex/config.toml"))',
        '(deny file-read* (literal "[private home redacted]/.config/simple/operator.md"))',
        '(deny file-write* (literal "[private home redacted]/.codex/config.toml"))',
        '(deny file-write* (literal "[private home redacted]/.codex/hooks.json"))',
        '(deny file-write* (subpath "[private home redacted]/.codex/plugins"))',
        '(deny file-write* (subpath "[private home redacted]/.codex/skills"))',
        '(deny file-write* (subpath "[private home redacted]/.agents"))',
        '(deny file-write* (subpath "[private home redacted]/.config/simple"))',
        f'(deny file-read* (subpath "{REPO}"))',
        f'(deny file-write* (subpath "{REPO}"))',
        '(deny file-read* (subpath "[private home redacted]/.codex/plugins"))',
        '(deny file-read* (subpath "[private home redacted]/.codex/skills"))',
        '(deny file-read* (subpath "[private home redacted]/.agents/skills"))',
        '(deny file-read* (subpath "[private home redacted]/.codex/memories"))',
        f'(deny file-read* (subpath "{RUNTIME / "preflight"}"))',
    ]
    for case, arm, repeat in MATRIX:
        other = RUNTIME / "cells" / f"{case}__{arm}__{repeat}"
        if other != cell:
            protected.append(f'(deny file-read* (subpath "{other}"))')
            protected.append(f'(deny file-write* (subpath "{other}"))')
    return " ".join(protected)


def preflight(workspace, runtime, profile, hook_command, environment, output):
    payload = {
        "hook_event_name": "SessionStart", "cwd": str(workspace),
        "session_id": "local-wrapper-preflight", "source": "startup", "model": PROTOCOL["model"],
    }
    result = subprocess.run(
        ["sandbox-exec", "-p", profile, "/bin/zsh", "-c", hook_command],
        cwd=workspace, env=environment, input=json.dumps(payload), text=True, capture_output=True,
    )
    try:
        context = json.loads(result.stdout)["hookSpecificOutput"]
        valid = result.returncode == 0 and context["hookEventName"] == "SessionStart" and "Repository-specific Simple context" in context["additionalContext"]
    except (ValueError, KeyError):
        valid = False
    record = {"argv": ["sandbox-exec", "-p", profile, "/bin/zsh", "-c", hook_command],
              "input": payload, "returncode": result.returncode, "stdout": result.stdout, "stderr": result.stderr,
              "valid": valid, "not_native_model_execution": True}
    write(output / "wrapper-preflight.json", record)
    trace = runtime / "native-hooks.jsonl"
    if trace.exists():
        shutil.copy2(trace, output / "wrapper-preflight-hooks.jsonl")
        trace.rename(runtime / "wrapper-preflight-hooks.jsonl")
    return valid


def run_cell(case, arm, repeat, ordinal):
    name = f"{case}__{arm}__{repeat}"
    output = RECORD / "cells" / name
    cell = RUNTIME / "cells" / name
    workspace = cell / "workspace"
    runtime = cell / "runtime"
    output.mkdir(parents=True, exist_ok=False)
    runtime.mkdir(parents=True, exist_ok=False)
    shutil.copytree(INPUTS / "cases" / case, workspace)
    shutil.copytree(INPUTS / "shared-skill", workspace / ".agents/skills/simple")
    subprocess.run(["git", "init", "--quiet", str(workspace)], check=True, capture_output=True)
    subprocess.run(["git", "add", "--all"], cwd=workspace, check=True, capture_output=True)
    before = file_state(workspace)
    write(output / "original-file-hashes.json", before)
    plugin = RUNTIME / "plugins" / arm
    shutil.copy2(RECORD / "native-hook.py", runtime / "native-hook.py")
    write(runtime / "wrapper-settings.json", {"plugin": str(plugin)})
    shutil.copy2(runtime / "wrapper-settings.json", output / "wrapper-settings.json")
    hook_command = "python3 " + shlex.quote(str(runtime / "native-hook.py"))
    hooks = json.loads((INPUTS / arm / "hooks/hooks.json").read_text())
    for groups in hooks["hooks"].values():
        for group in groups:
            for hook in group["hooks"]:
                hook["command"] = hook_command
    write(output / "transformed-hooks.json", hooks)
    inline_hooks = toml(hooks["hooks"])
    write(output / "session-hooks.toml", "hooks=" + inline_hooks + chr(10))
    profile = isolation(cell)
    write(output / "sandbox.sb", profile + chr(10))
    for directory in [runtime / "state", runtime / "logs", runtime / "tmp"]:
        directory.mkdir()
    environment = os.environ.copy()
    environment["CODEX_SQLITE_HOME"] = str(runtime / "state")
    environment["SIMPLE_OPERATOR_FILE"] = str(runtime / "missing-operator.md")
    environment["TMPDIR"] = str(runtime / "tmp")
    environment_summary = {key: environment[key] for key in ["CODEX_SQLITE_HOME", "SIMPLE_OPERATOR_FILE", "TMPDIR"]}
    command = [
        "sandbox-exec", "-p", profile, "codex", "exec",
        "--ignore-user-config", "--ignore-rules", "--ephemeral", "--skip-git-repo-check",
        "--dangerously-bypass-approvals-and-sandbox", "--dangerously-bypass-hook-trust",
        "--disable", "plugins", "--disable", "remote_plugin", "--disable", "apps",
        "--disable", "memories", "--disable", "multi_agent", "--disable", "multi_agent_v2",
        "--disable", "skill_search", "--disable", "skill_mcp_dependency_install",
        "--enable", "skip_host_skill_discovery", "--enable", "hooks", "--enable", "code_mode_host",
        "--model", PROTOCOL["model"], "--cd", str(workspace), "--json",
        "--output-last-message", str(runtime / "last-message.md"),
        "-c", "model_reasoning_effort=" + PROTOCOL["reasoning"],
        "-c", "sqlite_home=" + json.dumps(str(runtime / "state")),
        "-c", "log_dir=" + json.dumps(str(runtime / "logs")),
        "-c", "hooks=" + inline_hooks, "-",
    ]
    prompt = (INPUTS / "cases" / case / "prompt.md").read_bytes()
    write(output / "settings.json", {
        "argv": command, "cwd": str(workspace), "environment_overrides": environment_summary,
        "actual_home_and_codex_home_unchanged": True, "model_requested": PROTOCOL["model"],
        "reasoning": PROTOCOL["reasoning"], "timeout_seconds": 240,
        "stdin_prompt_sha256": hashlib.sha256(prompt).hexdigest(), "ordinal": ordinal,
        "hook_registration_events": list(hooks["hooks"]),
        "plugin_hashes": {str(path.relative_to(plugin)): digest(path) for path in [plugin / "hooks/hooks.json", plugin / "scripts/hook.mjs"]},
    })
    if not preflight(workspace, runtime, profile, hook_command, environment, output):
        result = {"cell": name, "ordinal": ordinal, "model_called": False, "native_valid": False,
                  "setup_failure": "transformed wrapper command failed its known SessionStart preflight"}
        write(output / "result.json", result)
        return result
    print(json.dumps({"event": "cell_start", "cell": name, "ordinal": ordinal, "at": now()}), flush=True)
    start_ns = time.time_ns()
    started = time.monotonic()
    write(output / "start.json", {"at": now(), "atNs": start_ns, "ordinal": ordinal})
    timestamps = []
    failure = None
    with (output / "events.jsonl").open("wb") as stdout, (output / "events-timing.jsonl").open("w") as timing, (output / "stderr.log").open("wb") as stderr:
        process = subprocess.Popen(command, cwd=workspace, env=environment, stdin=subprocess.PIPE,
                                   stdout=subprocess.PIPE, stderr=stderr, start_new_session=True)

        def read_output():
            for line in process.stdout:
                received = time.time_ns()
                stdout.write(line)
                stdout.flush()
                try:
                    event = json.loads(line)
                except ValueError:
                    event = {"unparsed": line.decode(errors="replace")}
                timestamps.append((received, event))
                timing.write(json.dumps({"receivedAtNs": received, "event": event}) + chr(10))
                timing.flush()

        reader = threading.Thread(target=read_output, daemon=True)
        reader.start()
        process.stdin.write(prompt)
        process.stdin.close()
        next_status = started + 30
        try:
            while process.poll() is None:
                if time.monotonic() - started > 240:
                    failure = "240-second native execution timeout"
                    os.killpg(process.pid, signal.SIGTERM)
                    try:
                        process.wait(timeout=3)
                    except subprocess.TimeoutExpired:
                        os.killpg(process.pid, signal.SIGKILL)
                        process.wait(timeout=3)
                    break
                if time.monotonic() >= next_status:
                    print(json.dumps({"event": "cell_running", "cell": name, "elapsed_seconds": round(time.monotonic() - started)}), flush=True)
                    next_status += 30
                time.sleep(0.2)
        finally:
            if process.poll() is None:
                os.killpg(process.pid, signal.SIGTERM)
                process.wait(timeout=3)
            try:
                os.killpg(process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            reader.join(timeout=5)
    end_ns = time.time_ns()
    write(output / "end.json", {"at": now(), "atNs": end_ns, "ordinal": ordinal})
    after = file_state(workspace)
    changed = sorted(key for key in set(before) | set(after) if before.get(key) != after.get(key))
    write(output / "final-file-hashes.json", after)
    trace_path = runtime / "native-hooks.jsonl"
    trace = []
    if trace_path.exists():
        shutil.copy2(trace_path, output / "native-hooks.jsonl")
        trace = [json.loads(line) for line in trace_path.read_text().splitlines() if line]
    answer = ""
    if (runtime / "last-message.md").exists():
        shutil.copy2(runtime / "last-message.md", output / "last-message.md")
        answer = (runtime / "last-message.md").read_text()
    shutil.copytree(workspace, output / "final-artifacts", ignore=shutil.ignore_patterns(".git", ".agents"))
    messages = [(at, event["item"]) for at, event in timestamps
                if event.get("type") == "item.completed" and event.get("item", {}).get("type") == "agent_message"]
    final_message_at = messages[-1][0] if messages else None
    session = [item for item in trace if item["input"].get("hook_event_name") == "SessionStart"]
    post = [item for item in trace if item["input"].get("hook_event_name") == "PostToolUse"]
    stop = [item for item in trace if item["input"].get("hook_event_name") == "Stop"]
    blocks = []
    reminders = []
    for item in stop:
        try:
            if json.loads(item["stdout"]).get("decision") == "block":
                blocks.append(item)
        except ValueError:
            pass
    for item in post:
        try:
            context = json.loads(item["stdout"]).get("hookSpecificOutput", {}).get("additionalContext", "")
            if "Before your final response" in context and "answer the user's request" in context:
                reminders.append(item)
        except ValueError:
            pass
    before_final = bool(final_message_at and reminders and all(item["atNs"] < final_message_at for item in reminders))
    native_valid = bool(session) and bool(answer) and process.returncode == 0 and not failure
    if case == "barcode":
        native_valid = native_valid and bool(changed)
        native_valid = native_valid and (bool(blocks) if arm == "baseline" else before_final and not stop and "Stop" not in hooks["hooks"])
    else:
        native_valid = native_valid and not changed and not reminders and not blocks
    checks = {"git_diff_check": capture(["git", "diff", "--check"], workspace)}
    if case == "barcode":
        checks["independent_barcode_verifier"] = capture(["node", str(RECORD / "verify-barcode.mjs"), str(workspace)], workspace)
        checks["smoke"] = capture(["node", "smoke.mjs"], workspace)
        artifact_pass = all(check["returncode"] == 0 for check in checks.values())
    else:
        checks["read_only_unchanged"] = {"passed": not changed, "changed_files": changed}
        artifact_pass = not changed and checks["git_diff_check"]["returncode"] == 0
    write(output / "checks.json", checks)
    usage = [event.get("usage") for _, event in timestamps if event.get("type") == "turn.completed"]
    reported_models = [{key: event[key] for key in ["model", "model_revision", "modelVersion"] if key in event}
                       for _, event in timestamps if any(key in event for key in ["model", "model_revision", "modelVersion"])]
    result = {
        "cell": name, "ordinal": ordinal, "case": case, "arm": arm, "repeat": repeat,
        "model_called": True, "returncode": process.returncode, "failure": failure,
        "latency_ms": round((time.monotonic() - started) * 1000),
        "native_valid": native_valid, "artifact_pass": artifact_pass,
        "final_answer_grade": "pending_root_manual_review", "changed_files": changed,
        "session_start_events": len(session), "post_tool_events": len(post),
        "stop_events": len(stop), "stop_blocks": len(blocks), "reconciliation_contexts": len(reminders),
        "candidate_context_before_final": before_final, "agent_message_count": len(messages),
        "last_message_nonempty": bool(answer), "usage_raw": usage,
        "reported_model_revision": reported_models or "not exposed in native exec JSONL",
        "limits": PROTOCOL["limits"],
    }
    write(output / "result.json", result)
    return result


def main():
    assert PROTOCOL["model"] == "gpt-6-luna" and PROTOCOL["reasoning"] == "medium"
    assert not (RECORD / "run-summary.json").exists(), "Never rerun a started frozen screen."
    expected_hashes = json.loads((RECORD / "source-hashes.json").read_text())
    assert all(digest(INPUTS / name) == expected for name, expected in expected_hashes.items())
    discovery = json.loads((RECORD / "discovery/outcome.json").read_text())
    assert discovery["inline_sources_verified"] and discovery["model_listing"]["listed"]
    write(RECORD / "cell-order.json", [{"ordinal": index + 1, "case": case, "arm": arm, "repeat": repeat}
                                     for index, (case, arm, repeat) in enumerate(MATRIX)])
    summary = {"registered_protocol_sha256": digest(RECORD / "registered-protocol.json"),
               "maximum_model_calls": 6, "started_at": now(), "status": "running", "cells": []}
    write(RECORD / "run-summary.json", summary)
    for index, (case, arm, repeat) in enumerate(MATRIX):
        result = run_cell(case, arm, repeat, index + 1)
        summary["cells"].append(result)
        summary["model_calls"] = sum(item["model_called"] for item in summary["cells"])
        if not result["native_valid"]:
            summary["status"] = "stopped_native_or_setup_failure"
            summary["stopped_at"] = now()
        write(RECORD / "run-summary.json", summary)
        print(json.dumps({"event": "cell_completed", **result}), flush=True)
        if not result["native_valid"]:
            return
    summary["status"] = "completed_pending_root_grading"
    summary["finished_at"] = now()
    summary["frozen_source_hashes_unchanged"] = all(digest(INPUTS / name) == expected for name, expected in expected_hashes.items())
    write(RECORD / "run-summary.json", summary)
    print(json.dumps({"event": "screen_completed", "model_calls": summary["model_calls"]}), flush=True)


if __name__ == "__main__":
    main()
