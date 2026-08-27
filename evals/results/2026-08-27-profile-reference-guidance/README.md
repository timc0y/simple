# Profile-reference guidance

## Decision

Add one co-location rule to `references/profile-template.md`. It increased strict
profile-authoring passes from 2 of 6 to 5 of 6 while staying outside ordinary task
context.

The candidate says:

```text
`Ordinary paths` records the reusable route. Name each existing owner, workflow, or
supported mechanism that materially changes the design, together with the observable
behaviour the next agent can rely on.
```

This corrects the measured failure more reliably than adding `supported mechanisms`
to the generated template placeholder, which previously tied current at 1 of 6.

## Result

| Profile guidance | Strict passes |
| --- | ---: |
| Current | 2/6 |
| Co-locates owner, mechanism, and behaviour | 5/6 |

The remaining candidate failure invented telemetry and verification coverage and did
not keep all serializer behaviour under `Ordinary paths`. The candidate therefore does
not make profile authoring deterministic, but it materially improves the targeted
behaviour without changing the core skill or generated profile size.

## Method

Luna and Terra each completed the same `SIMPLE.md` three times from supplied repository
facts. Both conditions used the current template and Simple skill. The candidate added
only the disclosed profile-reference paragraph.

The isolated harness blocked the repository, global skills, plugins, apps, hooks,
rules, user configuration, and multi-agent support. Both anonymous graders accepted
the known-pass and rejected the known-fail reference before grading candidates.

`mapping.tsv` identifies conditions after grading. `results.tsv` contains both grader
decisions. `raw/` contains solver answers, and `grades/` contains the grade records. The
candidate diff and reusable runner remain under `evals/repository-work-shapes/`.
