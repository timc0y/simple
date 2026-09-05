import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export function validateResults(records, root = null) {
  const failures = [];
  if (!Array.isArray(records)) return ["top level must be an array"];
  const recordFields = new Set(["schemaVersion", "recordedAt", "skillCommit", "model", "harness", "condition", "adapter", "tasks"]);
  const taskFields = new Set(["id", "passed", "interventions", "unsupportedClaims", "lostFacts", "formattingViolations", "operatorAttributionErrors", "modeConfusions", "safetyBoundaryViolations", "unprovenSimulationClaims", "inputTokens", "outputTokens", "latencyMs", "costUsd", "evidence", "notes", "invoked", "graderVerdicts"]);
  const countFields = ["interventions", "unsupportedClaims", "lostFacts", "formattingViolations", "operatorAttributionErrors", "modeConfusions", "safetyBoundaryViolations", "unprovenSimulationClaims", "inputTokens", "outputTokens", "latencyMs"];

  records.forEach((record, recordIndex) => {
    const at = `record ${recordIndex}`;
    for (const field of Object.keys(record || {})) if (!recordFields.has(field)) failures.push(`${at}: unknown field ${field}`);
    if (record?.schemaVersion !== 1) failures.push(`${at}: schemaVersion must be 1`);
    for (const field of ["recordedAt", "skillCommit", "harness", "condition"]) {
      if (typeof record?.[field] !== "string" || !record[field]) failures.push(`${at}: missing ${field}`);
    }
    if (record?.recordedAt && Number.isNaN(Date.parse(record.recordedAt))) failures.push(`${at}: invalid recordedAt`);
    if (!(record?.adapter === undefined || record.adapter === null || typeof record.adapter === "string")) failures.push(`${at}: adapter must be a string or null`);
    for (const field of ["name", "revision", "reasoning"]) {
      if (typeof record?.model?.[field] !== "string" || !record.model[field]) failures.push(`${at}: missing model.${field}`);
    }
    if (!Array.isArray(record?.tasks) || record.tasks.length === 0) {
      failures.push(`${at}: tasks must be a non-empty array`);
      return;
    }

    const taskIds = new Set();
    record.tasks.forEach((task, taskIndex) => {
      const taskAt = `${at}, task ${taskIndex}`;
      for (const field of Object.keys(task || {})) if (!taskFields.has(field)) failures.push(`${taskAt}: unknown field ${field}`);
      if (typeof task?.id !== "string" || !task.id) failures.push(`${taskAt}: missing id`);
      if (taskIds.has(task?.id)) failures.push(`${taskAt}: duplicate id ${task.id}`);
      taskIds.add(task?.id);
      if (typeof task?.passed !== "boolean") failures.push(`${taskAt}: passed must be boolean`);
      if (!(typeof task?.evidence === "string" || task?.evidence === null)) failures.push(`${taskAt}: evidence must be a string or null`);
      if (root && typeof task?.evidence === "string" && !existsSync(join(root, task.evidence))) {
        failures.push(`${taskAt}: missing evidence ${task.evidence}`);
      }
      for (const grader of ["luna", "terra"]) {
        const verdict = task?.graderVerdicts?.[grader];
        if (verdict !== undefined && typeof verdict !== "boolean") failures.push(`${taskAt}: graderVerdicts.${grader} must be boolean`);
      }
      if (task?.invoked !== undefined && typeof task.invoked !== "boolean") failures.push(`${taskAt}: invoked must be boolean`);
      for (const field of countFields) {
        const value = task?.[field];
        if (!(value === undefined || value === null || Number.isInteger(value) && value >= 0)) failures.push(`${taskAt}: ${field} must be a non-negative integer or null`);
      }
      if (!(task?.costUsd === undefined || task.costUsd === null || typeof task.costUsd === "number" && task.costUsd >= 0)) failures.push(`${taskAt}: costUsd must be a non-negative number or null`);
      if (!(task?.notes === undefined || task.notes === null || typeof task.notes === "string")) failures.push(`${taskAt}: notes must be a string or null`);
    });
  });
  return failures;
}

export function normalizeResults(recordDirectory, { skillCommit, harness, reasoning = "default", recordedAt = new Date().toISOString() }) {
  const mapping = readTsv(join(recordDirectory, "mapping.tsv"), ["id", "run", "case", "model", "condition"]);
  const results = readTsv(join(recordDirectory, "results.tsv"));
  const modelMetadata = existsSync(join(recordDirectory, "models.tsv"))
    ? new Map(readTsv(join(recordDirectory, "models.tsv")).map((model) => [model.key, model]))
    : new Map();
  const ids = new Map(mapping.map((row) => [key(row), row.id]));
  const groups = new Map();

  for (const row of results) {
    const groupKey = `${row.model}\t${row.condition}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    const id = ids.get(key(row));
    if (!id) throw new Error(`No mapping for ${key(row)}`);
    groups.get(groupKey).push({
      id: `${row.case}__r${row.run}`,
      passed: row.strict === "true",
      evidence: `raw/${id}.md`,
      graderVerdicts: { luna: row.luna === "true", terra: row.terra === "true" },
      ...(row.opened === undefined ? {} : { invoked: row.opened === "true" })
    });
  }

  return [...groups.entries()].map(([groupKey, tasks]) => {
    const [model, condition] = groupKey.split("\t");
    const metadata = modelMetadata.get(model);
    const usesSimple = /simple|candidate|canonical|current/.test(condition);
    return {
      schemaVersion: 1,
      recordedAt,
      skillCommit: usesSimple ? skillCommit : "none",
      model: {
        name: metadata?.name || model,
        revision: metadata?.revision || model,
        reasoning: metadata?.reasoning || reasoning
      },
      harness: metadata?.harness || harness,
      condition,
      adapter: condition.includes("candidate") ? condition : null,
      tasks
    };
  });
}

function readTsv(path, suppliedFields = null) {
  const allLines = readFileSync(path, "utf8").trim().split("\n");
  const fields = suppliedFields || allLines.shift().split("\t");
  const lines = allLines;
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split("\t").map((value, index) => [fields[index], value])));
}

function key(row) {
  return `${row.run}\t${row.case}\t${row.model}\t${row.condition}`;
}

const invokedPath = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedPath) {
  const [recordDirectory, skillCommit, harness, recordedAt] = process.argv.slice(2);
  if (!recordDirectory || !skillCommit || !harness) {
    console.error("usage: normalize-results.mjs <record-directory> <skill-commit> <harness> [recorded-at]");
    process.exit(2);
  }
  const records = normalizeResults(recordDirectory, { skillCommit, harness, recordedAt: recordedAt || new Date().toISOString() });
  const failures = validateResults(records, recordDirectory);
  if (failures.length) throw new Error(failures.join("\n"));
  writeFileSync(join(recordDirectory, "results.json"), `${JSON.stringify(records, null, 2)}\n`);
}
