#!/usr/bin/env python3
"""Stage public evidence without changing inputs or interpreting model behaviour."""
from pathlib import Path
import hashlib
import json
import re
import shutil

DEST = Path(__file__).resolve().parent
SOURCE = DEST.parent / "evaluation"
REDACTED = "[REDACTED: private operator body; original hash in staging-manifest.json]"
SESSION_REDACTED = "[REDACTED: SessionStart context or output preview; original hash in staging-manifest.json]"


def sha(data):
    return hashlib.sha256(data).hexdigest()


operators = [p.read_text().strip() for p in sorted((SOURCE / "frozen").glob("*/operator.md"))]
PRIVATE_FRAGMENTS = set()
for body in operators:
    for line in body.split("## Guard", 1)[0].splitlines():
        if line.startswith("# Operator"):
            PRIVATE_FRAGMENTS.add(line)
        elif line.startswith("- "):
            PRIVATE_FRAGMENTS.add(line[2:50])
entries = []


def redact(text):
    changes = []
    for body in operators:
        if body in text:
            text = text.replace(body, REDACTED)
            changes.append("private operator body")
    if any(fragment in text for fragment in PRIVATE_FRAGMENTS):
        return REDACTED, ["private operator fragment or output preview"]
    substitutions = (
        (r"/(?:private/)?tmp/simple-auth-(?:screen|discovery|selfcheck)-[^/\s\"']+", "<fixture-runtime>"),
        (r"/Users/[^/\s\"']+", "<user-home>"),
        (r"/var/folders/[^\s\"']+", "<machine-temporary-path>"),
    )
    for pattern, replacement in substitutions:
        text, count = re.subn(pattern, replacement, text)
        if count:
            changes.append("machine paths")
    return text, sorted(set(changes))


def record(path, action, target=None, redactions=None):
    data = path.read_bytes()
    entry = {"original": path.relative_to(SOURCE).as_posix(), "original_sha256": sha(data), "action": action}
    if target is not None:
        entry["staged"] = target.relative_to(DEST).as_posix()
        entry["staged_sha256"] = sha(target.read_bytes())
    if redactions:
        entry["redactions"] = redactions
    entries.append(entry)


def clean(value, changes):
    if isinstance(value, str):
        text, found = redact(value)
        changes.extend(found)
        return text
    if isinstance(value, list):
        return [clean(item, changes) for item in value]
    if isinstance(value, dict):
        result = {}
        session = value.get("eventName") == "sessionStart"
        for key, item in value.items():
            if key == "delivered_session_context":
                result[key] = SESSION_REDACTED
                result["delivered_session_context_present"] = bool(item)
                changes.append("whole SessionStart delivered context")
            elif session and key == "entries":
                result[key] = [{"kind": entry.get("kind"), "text": SESSION_REDACTED, "content_present": bool(entry.get("text"))} for entry in item]
                changes.append("whole SessionStart entries and output previews")
            elif session and key in ("stdout", "stderr", "output", "outputPreview", "statusMessage") and item:
                result[key] = SESSION_REDACTED
                changes.append("whole SessionStart output preview")
            else:
                result[key] = clean(item, changes)
        return result
    return value


def copy(path, target=None, sanitize=False):
    target = target or DEST / path.relative_to(SOURCE)
    target.parent.mkdir(parents=True, exist_ok=True)
    if sanitize:
        original = path.read_text()
        changes = []
        if path.suffix == ".json":
            value = clean(json.loads(original), changes)
            text = json.dumps(value, indent=2) + "\n"
        elif path.suffix == ".jsonl":
            text = "".join(json.dumps(clean(json.loads(line), changes)) + "\n" for line in original.splitlines() if line)
        else:
            text, changes = redact(original)
        if changes:
            target.write_text(text)
            record(path, "redacted", target, sorted(set(changes)))
        else:
            shutil.copyfile(path, target)
            record(path, "copied", target)
    else:
        shutil.copyfile(path, target)
        record(path, "copied", target)


def omit(path, reason):
    record(path, "omitted", redactions=[reason])


for name in ("runner.py", "verify-ledger.py", "registered-protocol.json", "case-hashes.json", "condition-manifest.json", "baseline-snapshot.json", "setup-ready.json", "verifier-calibration.json"):
    path = SOURCE / name
    if path.exists():
        copy(path, sanitize=name.endswith(".json"))

for path in sorted((SOURCE / "cases").rglob("*")):
    if path.is_file():
        copy(path, sanitize=True)

for path in sorted((SOURCE / "frozen").rglob("*")):
    if not path.is_file():
        continue
    if path.name == "operator.md":
        target = DEST / path.relative_to(SOURCE)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(REDACTED + "\n")
        record(path, "redacted", target, ["whole private operator file omitted"])
    else:
        copy(path)

for path in sorted((SOURCE / "recorder-selfcheck").rglob("*")):
    if path.is_file():
        copy(path, sanitize=True)

for directory in sorted(SOURCE.glob("discovery*")):
    for path in sorted(directory.rglob("*")):
        if not path.is_file():
            continue
        if path.name in ("outcome.json", "stderr.log", "hooks-list.json"):
            copy(path, sanitize=True)
        else:
            omit(path, "private discovery configuration, RPC trace or host inventory")

protocol = json.loads((SOURCE / "registered-protocol.json").read_text())
cells = []
allowed = {
    "seed-last-message.md", "followup-last-message.md", "seed-prompt.md", "followup-prompt.md",
    "action-record.json", "attempt-ledger.jsonl", "completion-ledger.jsonl", "ledger-check.json",
    "recorder-cleanup.json", "original-file-hashes.json", "final-file-hashes.json", "result.json",
    "usage.json", "hooks-list.json", "seed-turn-start.json", "followup-turn-start.json",
    "seed-turn-completed.json", "followup-turn-completed.json",
}
for case in protocol["cases_in_order"]:
    for condition in protocol["conditions"]:
        directory = SOURCE / "run/cells" / (case + "--" + condition)
        cells.append({"case": case, "condition": condition, "directory_present": directory.is_dir(), "result_present": (directory / "result.json").is_file()})
        if not directory.is_dir():
            continue
        duplicate = DEST / directory.relative_to(SOURCE) / "final-artifacts/.agents/skills/simple"
        if duplicate.is_dir():
            shutil.rmtree(duplicate)
        for path in sorted(directory.rglob("*")):
            if not path.is_file():
                continue
            if path.is_relative_to(directory / "final-artifacts/.agents/skills/simple"):
                omit(path, "duplicate assigned method tree; condition source retained in frozen snapshots, identity retained in final-file-hashes and protected-input checks")
            elif path.name in allowed or "final-artifacts" in path.parts:
                copy(path, sanitize=True)
            else:
                omit(path, "private RPC trace, runtime configuration or host inventory")

        action_path = directory / "action-record.json"
        events_path = directory / "events.jsonl"
        if action_path.is_file() and events_path.is_file():
            action_record = json.loads(action_path.read_text())
            tool_ids = {item["toolId"] for item in action_record.get("action_tool_evidence", [])}
            selected = []
            for line in events_path.read_text().splitlines():
                event = json.loads(line)
                payload = event.get("event", {})
                item = payload.get("params", {}).get("item", {})
                if payload.get("method") == "item/completed" and item.get("type") == "commandExecution" and item.get("id") in tool_ids:
                    selected.append(event)
            target = DEST / directory.relative_to(SOURCE) / "native-action-tool-results.json"
            changes = []
            target.write_text(json.dumps(clean(selected, changes), indent=2) + "\n")
            record(events_path, "derived exact action tool results", target, changes + ["item/completed commandExecution items extracted only for IDs listed in action_tool_evidence; other RPC messages omitted"])

for name in ("model-turn-count.json", "run-summary.json", "cleanup.json"):
    path = SOURCE / "run" / name
    if path.exists():
        copy(path, sanitize=True)

manifest = {
    "source_root": "evaluation/ beside public-staging/ in the private authorization-resolution record",
    "original_paths": "All original paths below are exact paths relative to source_root.",
    "snapshot": {"registered_cells": len(cells), "result_files_present": sum(cell["result_present"] for cell in cells), "cleanup_file_present": (SOURCE / "run/cleanup.json").is_file()},
    "privacy": "Private operator bodies, machine paths, live configuration, RPC traces and transcript provenance are not public evidence. Original hashes identify withheld material.",
    "scope": "No grading, totals, normalized decision record or repository-source edits are performed by this script.",
    "reproduction_limit": "runner.py and verify-ledger.py are exact source copies. Full private operator conditions are withheld, so this public bundle alone cannot exactly replay the original condition. Operator redaction files must not be presented as original inputs.",
    "recorder": "The Recorder class and native binding verifier are inside exact runner.py; fixture-action.mjs is the generic recorder client in each case.",
    "deduplication": "Per-cell final-artifacts/.agents/skills/simple trees are omitted as duplicates of the retained frozen condition snapshots. Original file hashes remain in this manifest and each cell's final-file-hashes; protected-input checks, fixture outcomes and all last replies remain retained. Raw private evidence is unchanged.",
    "cells": cells,
    "files": entries,
}
(DEST / "staging-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({"staged_files": sum(e["action"] != "omitted" for e in entries), "manifest": str(DEST / "staging-manifest.json")}))
