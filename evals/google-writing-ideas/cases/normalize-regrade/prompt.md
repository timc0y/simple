Plan the smallest refactor for this real function from `evals/normalize-results.mjs`.
Do not write the code.

```js
export function normalizeResults(recordDirectory, options) {
  const mapping = readTsv(join(recordDirectory, "mapping.tsv"), mappingFields);
  const results = readTsv(join(recordDirectory, "results.tsv"));
  const records = buildRecords(mapping, results, options);
  writeFileSync(join(recordDirectory, "results.json"), JSON.stringify(records));
}
```

The repository now needs this behaviour:

- A second grade must not overwrite an earlier grade.
- If the same answer and the same rubric get different verdicts, the result becomes
  `unstable` and cannot count as a skill gain.
- A changed answer or changed rubric starts a new comparison and is not instability.
- The comparison policy must be checked without filesystem setup.
- `normalize-results.mjs` remains the owner. Do not add a database, dependency, class,
  service, or second result format.

Return a concise implementation plan with proof.
