# Profile-template wording

## Decision

Do not add `supported mechanisms` to the `Ordinary paths` placeholder. Current and
candidate templates each passed 1 of 6 strict cells. The extra words did not improve
where or how agents recorded the supplied mechanism.

## Result

| Template | Strict passes |
| --- | ---: |
| Current | 1/6 |
| Adds `supported mechanisms` | 1/6 |

Most answers named `CustomerSerializer` but omitted part of its observable alias
behaviour from `Ordinary paths`, or placed that behaviour under `Preserve` or `Current
boundary`. The candidate wording did not change this distribution.

The rubric intentionally required the owner, mechanism, and its accept, conflict, and
dual-output behaviour together under `Ordinary paths`. That location makes the reusable
route explicit, but an agent may still receive the fact when it is recorded elsewhere
in the same injected profile. Therefore the low absolute score should not be read as a
general profile-quality score. The equal arms still show that this wording did not move
the targeted behaviour.

## Method

Luna and Terra each completed a `SIMPLE.md` three times from the same observed facts.
Both conditions used the same Simple skill. The candidate changed only this template
line:

```diff
-- Record the existing owners and workflows agents should reuse.
+- Record the existing owners, workflows, and supported mechanisms agents should reuse.
```

The isolated harness blocked the repository, global skills, plugins, apps, hooks,
rules, user configuration, and multi-agent support. Both anonymous graders accepted
the known-pass and rejected the known-fail reference before grading candidates.

`mapping.tsv` identifies conditions after grading. `results.tsv` contains both grader
decisions. `raw/` contains solver answers, and `grades/` contains the grade records. The
discarded candidate and reusable runner remain under `evals/repository-work-shapes/`.
