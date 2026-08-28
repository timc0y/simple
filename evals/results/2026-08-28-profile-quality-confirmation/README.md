# Profile quality confirmation

## Decision

Keep the candidate. It makes every `SIMPLE.md` task load the profile guide. The guide
now defines the evidence interview, the section boundaries, the semantic review, and
same-change maintenance.

The candidate increased strict passes from 5 of 24 to 9 of 24. Both anonymous graders
had to pass the reference self-test before their grades counted.

## Result

| Case | Current | Candidate |
| --- | ---: | ---: |
| Evidence interview | 0/6 | 1/6 |
| Semantic review | 1/6 | 3/6 |
| Same-change maintenance | 4/6 | 4/6 |
| Concise profile structure | 0/6 | 1/6 |
| **Total** | **5/24** | **9/24** |

Luna improved from 1 of 12 to 3 of 12. Terra improved from 4 of 12 to 6 of 12.
The candidate caused no strict regression in any case.

## Method

Luna and Terra each completed four held-out tasks three times with the current or
candidate Simple skill. The tasks covered profile initiation, review, maintenance, and
compression. The isolated harness blocked repository files, global skills, plugins,
apps, hooks, user rules, and multi-agent support.

Luna and Terra graded all answers independently. Candidate IDs did not disclose the
model or condition. Each grader accepted the known-pass reference and rejected the
known-fail reference for all four cases.

The runner grades Luna and Terra in sequence. Earlier exploratory runs showed that
parallel graders raced while Codex prepared local system skills. The grader prompt also
uses an exact empty JSON schema, because an earlier prompt caused a model to copy a
placeholder ID. These harness changes apply equally to both conditions.

The [candidate diff](candidate.diff), [runner](run.sh),
`mapping.tsv`, `results.tsv`, `results.json`, `raw/`, and `grades/` contain the exact
decision evidence.

## Limit

Nine strict passes out of 24 is not deterministic performance. The candidate is worth
keeping because it improves both models and adds no case regression. The remaining
failures show that instruction text cannot guarantee semantic profile quality.
