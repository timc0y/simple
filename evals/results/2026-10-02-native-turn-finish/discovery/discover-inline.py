#!/usr/bin/env python3
"""List frozen session hooks without starting a model turn."""
from pathlib import Path
import argparse
import hashlib
import json
import os
import queue
import signal
import subprocess
import threading
import time

RECORD = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument("--fixture-root", type=Path, required=True)
args = parser.parse_args()
fixture_root = args.fixture_root.resolve()
working_directory = fixture_root / "runtime/discovery-cwd"
state_directory = fixture_root / "runtime/state-discovery"
log_directory = fixture_root / "runtime/log-discovery"
plugin = fixture_root / "plugins/candidate"
hook_file = plugin / "hooks/hooks.json"
hook_script = plugin / "scripts/hook.mjs"
assert working_directory.is_dir()
assert state_directory.is_dir()
assert not (working_directory / ".codex").exists()


def write(name, value):
    path = RECORD / name
    path.write_text(value if isinstance(value, str) else json.dumps(value, indent=2) + chr(10))


def toml(value):
    if isinstance(value, dict):
        return "{" + ",".join(json.dumps(key) + "=" + toml(item) for key, item in value.items()) + "}"
    if isinstance(value, list):
        return "[" + ",".join(toml(item) for item in value) + "]"
    return json.dumps(value)


hooks = json.loads(hook_file.read_text())["hooks"]
for groups in hooks.values():
    for group in groups:
        for hook in group["hooks"]:
            hook["command"] = f'node "{hook_script}"'
inline_hooks = toml(hooks)
write("session-hooks.toml", "hooks=" + inline_hooks + chr(10))
protected_profile = " ".join([
    "(version 1)", "(allow default)",
    '(deny file-read* (literal "[private home redacted]/.codex/hooks.json"))',
    '(deny file-write* (literal "[private home redacted]/.codex/config.toml"))',
    '(deny file-write* (literal "[private home redacted]/.codex/hooks.json"))',
    '(deny file-write* (subpath "[private home redacted]/.codex/plugins"))',
    '(deny file-write* (subpath "[private home redacted]/.codex/skills"))',
    '(deny file-write* (subpath "[private home redacted]/.agents"))',
    '(deny file-write* (subpath "[private home redacted]/.config/simple"))',
    '(deny file-write* (subpath "[private repository root redacted]"))',
])
write("sandbox.sb", protected_profile + chr(10))
command = [
    "sandbox-exec", "-p", protected_profile,
    "codex", "app-server", "--stdio",
    "--disable", "code_mode_host", "--disable", "plugins",
    "--disable", "remote_plugin", "--disable", "apps",
    "--disable", "memories", "--disable", "skill_mcp_dependency_install",
    "--enable", "skip_host_skill_discovery", "--enable", "hooks",
    "-c", "sqlite_home=" + json.dumps(str(state_directory)),
    "-c", "log_dir=" + json.dumps(str(log_directory)),
    "-c", "hooks=" + inline_hooks,
]
environment = os.environ.copy()
environment["CODEX_SQLITE_HOME"] = str(state_directory)
environment["SIMPLE_OPERATOR_FILE"] = str(fixture_root / "runtime/missing-operator.md")
write("settings.json", {
    "argv": command,
    "cwd": str(working_directory),
    "environment_overrides": {key: environment[key] for key in ["CODEX_SQLITE_HOME", "SIMPLE_OPERATOR_FILE"]},
    "actual_home_and_codex_home_unchanged": True,
    "model_turns": 0,
    "timeout_seconds": 45,
    "source_sha256": {
        str(path): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in [hook_file, hook_script]
    },
})

started = time.monotonic()
deadline = started + 45
process = subprocess.Popen(
    command, cwd=working_directory, env=environment,
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    bufsize=0, start_new_session=True,
)
output = queue.Queue()
diagnostics = []
reader = threading.Thread(target=lambda: [output.put(line) for line in process.stdout], daemon=True)
error_reader = threading.Thread(target=lambda: [diagnostics.append(line) for line in process.stderr], daemon=True)
reader.start()
error_reader.start()
requests = (RECORD / "requests.jsonl").open("wb")
responses = (RECORD / "responses.jsonl").open("w")


def record_response(value):
    responses.write(json.dumps(value) + chr(10))
    responses.flush()


def send(value):
    wire = json.dumps(value).encode() + bytes([10])
    requests.write(wire)
    requests.flush()
    written = process.stdin.write(wire)
    process.stdin.flush()
    assert written == len(wire) and wire[-1] == 10


def receive(identifier):
    last_status = time.monotonic()
    while time.monotonic() < deadline:
        if process.poll() is not None:
            return {"process_exit": process.returncode}
        try:
            event = json.loads(output.get(timeout=1))
        except queue.Empty:
            if time.monotonic() - last_status >= 10:
                print(json.dumps({"elapsed_seconds": round(time.monotonic() - started), "waiting_for_id": identifier}), flush=True)
                last_status = time.monotonic()
            continue
        if event.get("id") == identifier:
            return event
        record_response({"notification_method": event.get("method"), "id": event.get("id")})
    return {"timeout": True}


def request(identifier, method, params):
    send({"jsonrpc": "2.0", "id": identifier, "method": method, "params": params})
    return receive(identifier)


outcome = {"inline_sources_verified": False, "model_turns": 0}
try:
    send({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
        "clientInfo": {"name": "simple-hook-discovery", "version": "0.1.0"},
        "capabilities": {"experimentalApi": True},
    }})
    send({"jsonrpc": "2.0", "method": "initialized", "params": {}})
    initialized = receive(1)
    record_response({"id": 1, "result_present": "result" in initialized, "error": initialized.get("error"), "timeout": initialized.get("timeout")})
    outcome["initialized"] = "result" in initialized
    if "result" in initialized:
        listing = request(2, "hooks/list", {"cwds": [str(working_directory)]})
        record_response(listing)
        entries = listing.get("result", {}).get("data", [])
        registered = [hook for entry in entries for hook in entry.get("hooks", [])]
        events = {hook["eventName"] for hook in registered}
        sources = {hook["source"] for hook in registered}
        outcome.update({
            "hook_count": len(registered), "event_names": sorted(events), "sources": sorted(sources),
            "hook_errors": [error for entry in entries for error in entry.get("errors", [])],
            "hook_warnings": [warning for entry in entries for warning in entry.get("warnings", [])],
            "inline_sources_verified": len(registered) == 4
                and events == {"sessionStart", "subagentStart", "preToolUse", "postToolUse"}
                and sources == {"sessionFlags"},
        })
        models = request(3, "model/list", {})
        model_result = models.get("result", {})
        exact_model = any(item.get("model") == "gpt-6-luna" or item.get("id") == "gpt-6-luna" for item in model_result.get("data", []))
        model_summary = {
            "id": 3, "filtered_to_exact_slug": "gpt-6-luna",
            "listed": exact_model if "result" in models else None,
            "catalog_complete": model_result.get("nextCursor") is None if "result" in models else None,
            "error": models.get("error"), "timeout": models.get("timeout"),
        }
        record_response(model_summary)
        outcome["model_listing"] = model_summary
        config = request(4, "config/read", {"cwd": str(working_directory), "includeLayers": True})
        layer_summary = {
            "id": 4, "filtered_to_layer_metadata": True, "error": config.get("error"),
            "layers": [{
                "name": layer.get("name"), "disabledReason": layer.get("disabledReason"),
                "config_keys": list(layer.get("config", {})),
                "hooks_keys": list(layer.get("config", {}).get("hooks", {})),
            } for layer in config.get("result", {}).get("layers", [])],
        }
        record_response(layer_summary)
        outcome["config_layers"] = layer_summary["layers"]
finally:
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait(timeout=3)
    reader.join(timeout=1)
    error_reader.join(timeout=1)
    requests.close()
    responses.close()
    write("stderr.log", b"".join(diagnostics).decode())
    outcome.update({"elapsed_seconds": round(time.monotonic() - started), "process_returncode": process.returncode})
    write("outcome.json", outcome)
    print(json.dumps(outcome), flush=True)
