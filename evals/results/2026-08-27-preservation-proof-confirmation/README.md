# Preservation-proof confirmation

## Decision

Do not add the preservation-proof sentence to Simple. It reduced strict passes on the
two targeted cases from 18 of 24 to 13 of 24.

The candidate said:

```text
Before finishing, pair every preserved contract and material failure consequence
with an independent check. Stating that behaviour will be preserved is not proof.
```

This sounds correct but did not reliably make answers preserve more. Current Simple
already carries the independent-proof requirement; repeating it with stronger wording
added prominence without correcting the observed omissions.

## Result

| Condition | Startup root cause | Production data | Total |
| --- | ---: | ---: | ---: |
| Current Simple | 6/6 | 3/6 | 9/12 |
| Current Simple and Ponytail | 6/6 | 3/6 | 9/12 |
| Candidate Simple | 4/6 | 3/6 | 7/12 |
| Candidate Simple and Ponytail | 3/6 | 3/6 | 6/12 |

The candidate did not change the production-data score. It regressed startup answers,
where several candidate runs omitted durable completed-task records or weakened the
condition for a resident process. Those are the obligations the candidate was intended
to protect.

## Method

Luna and Terra each solved `startup-root-cause` and `production-data` three times under
four forced-execution conditions. Each workspace contained the exact current or
candidate Simple skill, with Ponytail only in its named arm. The solver was required to
read the supplied skill or skills and relevant Simple references.

The sandbox blocked the repository, global skills, plugins, apps, hooks, rules, user
configuration, and multi-agent support. Luna and Terra then graded every anonymous
answer independently. Each grader first accepted the known-pass reference and rejected
the known-fail reference for its case.

This confirmation followed a one-repetition screen with a mixed one-cell candidate
gain. The larger focused run did not reproduce that signal.

`mapping.tsv` identifies conditions after grading. `results.tsv` contains both grader
decisions. `raw/` contains all solver answers, and `grades/` contains the grade records.
The discarded candidate and reusable runner remain in `evals/repository-work-shapes/`.
