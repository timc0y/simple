#!/usr/bin/env node

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { check } from "../skills/simple/scripts/simple.mjs";

let source = "";
for await (const chunk of process.stdin) source += chunk;
let payload = {};
try {
  payload = source.trim() ? JSON.parse(source) : {};
} catch {}

const event = payload.hook_event_name ?? payload.hookEventName;
const root = payload.cwd ? resolve(payload.cwd) : process.cwd();
const hasProfile = existsSync(resolve(root, "SIMPLE.md"));

if ((event === "SessionStart" || event === "SubagentStart") && hasProfile) {
  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: "For non-trivial design, invoke $simple and read SIMPLE.md; its facts and precedents override imagined requirements."
    }
  })}\n`);
}

if (event === "Stop" && hasProfile) {
  const failures = check(root);
  if (failures.length) {
    const reason = `Simple profile check failed: ${failures.join("; ")}`;
    const output = process.env.CLAUDE_PROJECT_DIR ? { decision: "block", reason } : { continue: false, stopReason: reason, systemMessage: reason };
    process.stdout.write(`${JSON.stringify(output)}\n`);
  }
}
