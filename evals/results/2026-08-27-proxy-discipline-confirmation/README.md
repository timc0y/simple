# Proxy discipline confirmation

## Decision

Do not add the candidate text to Simple. Current Simple and the candidate each passed
28 of 30 strict cells in this run. Each version passed 38 of 40 cells across both runs.

The candidate did not improve the pass rate. The failures also moved between cases and
models. Thus, the candidate did not correct a stable failure.

Keep the eval cases and the isolated runner. Keep the candidate in
`evals/proxy-discipline/candidate.diff` for the result record only.

## Result

| Condition | Strict passes | Mean answer words | Mean output tokens |
| --- | ---: | ---: | ---: |
| Current Simple | 28/30 | 115.3 | 737.5 |
| Candidate Simple | 28/30 | 111.0 | 727.4 |

The word and token differences are small. They do not show a reliable cost benefit.
The candidate also added about 501 input tokens to each solver call in this run.

Strict means that both graders passed an answer. Both graders accepted each pass
reference and rejected each fail reference before they graded the solver answers.

## Failures

Current Simple missed 2 cells. One answer did not prove the full billing flow. One
answer did not repeat the measured mobile load check.

The candidate also missed 2 cells. Both answers moved the correct code to the correct
owners. They did not prove all of the required billing behaviour.

The candidate fixed no repeated baseline failure. It also created no repeated new
failure in this small sample.

## Grade process

The first Luna grade call returned 59 of the required 60 grades. A second call also
returned 59 grades, but it omitted a different identifier. The runner rejected both
results.

The final grade stage used one anonymous call for each case. Each call used the same
criteria, references, and solver answers. This change reduced the size of each grade
response. It did not change the solver data or the pass rules.

The solver did not see the grader data. The grader did not see the condition or model
names. The runner revealed the condition map only after the grade step.

## Record

`mapping.tsv` identifies the anonymous cells after the grade step. `results.tsv`
contains both grader decisions. `raw/` contains all solver answers. `grades/` contains
the 10 case grade records and the 2 combined records. `usage.tsv` contains token counts.
