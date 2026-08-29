# Google writing ideas

This suite tests two ideas adapted from the Google Testing Blog outside test-writing:

- actionable review findings that connect an obligation, evidence, consequence, and
  correction while separating optional suggestions;
- contrastive near misses that help readers distinguish easily confused cases.

Run one suite at a time:

```sh
SUITE=actionable-review evals/google-writing-ideas/run.sh measure
SUITE=contrastive-example evals/google-writing-ideas/run.sh measure
```

Use `CONDITIONS`, `RUNS`, and `RUN_NAME` for a bounded confirmation. The runner keeps
solver calls and graders sequential because concurrent Codex processes can race while
preparing local system skills.
