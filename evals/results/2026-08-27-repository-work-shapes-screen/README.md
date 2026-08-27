# Repository work-shape screen

## Decision

Do not add the proof-routing candidate to Simple. Current Simple and the candidate
both passed all 10 strict cells. The candidate added instruction without improving
Simple alone. With Ponytail, current Simple passed 10 of 10 cells and the candidate
passed 7 of 10.

Keep the two new cases. They expose a greenfield start and a shared-owner bug fix that
the previous suite did not test directly.

## Result

| Condition | Strict passes |
| --- | ---: |
| No skill | 5/10 |
| Ponytail | 6/10 |
| Simple | 10/10 |
| Simple and Ponytail | 10/10 |
| Candidate Simple | 10/10 |
| Candidate Simple and Ponytail | 7/10 |

Strict means both anonymous graders passed the answer. Luna and Terra each solved all
five cases once and then graded each case independently. Every grader accepted its
known-pass reference and rejected its known-fail reference before its candidate grades
counted.

The candidate added one completion instruction:

```text
Match proof to the change: for a start or addition, run one caller-visible path end
to end; for a fix, make the smallest reliable reproduction fail before the owning
correction and pass after; for an improvement, compare the same real outcome before
and after, using a metric only when it represents that outcome.
```

## What failed

The three candidate-with-Ponytail failures were all Terra solver cells:

- Greenfield start added an unrelated-route check after the required first request.
- Shared-owner fix omitted the valid-tag case from its proof while saying that
  behaviour would be preserved.
- Startup root cause allowed a daemon for general latency or throughput rather than
  requiring a capability that cannot be represented as durable data.

One repetition cannot establish that the sentence caused those failures. It does not
need to: the candidate tied current Simple at the ceiling and therefore did not earn
its permanent context cost. The combined-arm result is a reason not to ship it, not a
claim of a stable interaction fault.

## Method

The runner copied the exact current or candidate skill into an isolated workspace. It
blocked the repository, global skills, plugins, apps, hooks, rules, user configuration,
and multi-agent support. Execution conditions explicitly read their supplied skills,
so this run measures behaviour after invocation rather than discovery.

The cases were:

- `greenfield-start`: start one native host route in an otherwise empty repository;
- `shared-owner-fix`: correct an optional-value rule at the parser shared by four
  callers;
- `startup-root-cause`: measure and remove an accidental compiler import before
  shipping a daemon;
- `ordinary-path`: add a daily import through the existing runner;
- `routine-edit`: return one requested comment without ceremony.

`mapping.tsv` reveals anonymous condition identifiers after grading. `results.tsv`
contains both grader decisions. `raw/` contains solver answers, and `grades/` contains
the grader records. The reusable runner and candidate remain in
`evals/repository-work-shapes/`.
