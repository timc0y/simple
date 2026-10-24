#!/usr/bin/env node

import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assembleContext } from "./context.mjs";

function quote(value) {
  if (/[\r\n\0]/.test(value)) throw new Error("Unsupported command path");
  if (process.platform === "win32") {
    if (/["%!]/.test(value)) throw new Error("Move the checkout to a path without quote, percent or exclamation characters");
    return `"${value}"`;
  }
  return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

export function hookConfiguration() {
  const command = `${quote(process.execPath)} ${quote(fileURLToPath(import.meta.url))} context`;
  return { simple: { PreInvocation: [{ type: "command", command, timeout: 3 }] } };
}

export function contextResponse(payload, options = {}) {
  const raw = payload?.workspacePaths;
  if (!Array.isArray(raw) || raw.some((path) => typeof path !== "string" || !isAbsolute(path))) {
    return { injectSteps: [{ ephemeralMessage: "Simple: workspace identity is unavailable. No repository context was injected; establish the active directory before reading its profile." }] };
  }
  const roots = [...new Set(raw.map((path) => resolve(path)))];
  if (roots.length !== 1) {
    return { injectSteps: [{ ephemeralMessage: "Simple: the host has zero or multiple workspace roots. No repository context was injected. Select the working directory for this task and read its nearest SIMPLE.md; do not merge unrelated profiles." }] };
  }
  const current = assembleContext({ ...options, cwd: roots[0] });
  for (const error of current.errors) process.stderr.write(`simple antigravity: ${error}\n`);
  if (!current.text) {
    return current.complete ? {} : { injectSteps: [{ ephemeralMessage: "Simple context is unavailable; read the owning sources before relying on repository facts." }] };
  }
  // Transient context avoids growing durable history on every model invocation.
  return { injectSteps: [{ ephemeralMessage: current.text }] };
}

async function readInput() {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    input += chunk;
    if (Buffer.byteLength(input) > 262144) throw new Error("Hook input exceeds 256 KiB");
  }
  return JSON.parse(input || "{}");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const mode = process.argv[2];
  try {
    if (mode === "config") process.stdout.write(`${JSON.stringify(hookConfiguration(), null, 2)}\n`);
    else if (mode === "context") process.stdout.write(`${JSON.stringify(contextResponse(await readInput()))}\n`);
    else {
      process.stderr.write("Usage: antigravity.mjs <config|context>\n");
      process.exitCode = 2;
    }
  } catch (error) {
    process.stderr.write(`simple antigravity: ${error instanceof SyntaxError ? "Invalid JSON hook input" : error.message}\n`);
    if (mode === "context") process.stdout.write("{}\n");
    else process.exitCode = 1;
  }
}
