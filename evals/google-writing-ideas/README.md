# Google writing ideas

This suite tests five ideas adapted from the Google Testing Blog outside test-writing:

- actionable review findings that connect an obligation, evidence, consequence, and
  correction while separating optional suggestions;
- contrastive near misses that help readers distinguish easily confused cases;
- a pure decision boundary when input and output operations hide policy;
- review resolutions that keep a non-obvious reason;
- published contracts that remain obligations without known consumers.

Run one suite at a time:

```sh
SUITE=actionable-review evals/google-writing-ideas/run.sh measure
SUITE=contrastive-example evals/google-writing-ideas/run.sh measure
SUITE=pure-decision evals/google-writing-ideas/run.sh measure
SUITE=review-resolution evals/google-writing-ideas/run.sh measure
SUITE=published-contract evals/google-writing-ideas/run.sh measure
```

Use `CONDITIONS`, `RUNS`, and `RUN_NAME` for a bounded confirmation. The runner uses
sequential calls and disables implicit system-skill discovery.
