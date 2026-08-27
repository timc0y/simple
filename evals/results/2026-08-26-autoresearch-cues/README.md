# Cue autoresearch, 26 August 2026

## Decision

Do not change the runtime skill from this loop.

The full Minto sentence scored 10 of 10. The baseline scored 9 of 10. However, the
sentence uses `supporting` as an adjective. This use does not obey the required STE100
rule. The 2 compliant replacements scored 8 of 10 and 9 of 10.

The short complexity sentence also scored 10 of 10. It ran with the full Minto
sentence and did not improve that score. Thus, it did not earn its added text.

The missed cells moved between unrelated cases. This movement shows that 1 run for each
variant is not enough for a causal claim.

## Method

Codex Luna and Terra each answered 5 cases. Luna and Terra then graded all 10 answers.
Each grader first accepted the known pass answer and rejected the known fail answer for
all 5 rubrics.

The metric is the number of answers that both graders accept. The maximum is 10. The
harness blocks the global skill paths. It makes each solver read the local Simple skill,
the repository facts, and the relevant references.

| Experiment | Change | Score | Decision |
| ---: | --- | ---: | --- |
| 0 | Canonical baseline | 9/10 | Baseline |
| 1 | Name the Minto Pyramid and its order | 10/10 | Reject after the STE100 check |
| 2 | Remove the Minto sentence | 9/10 | Discard |
| 3 | Bind cyclomatic complexity to repository evidence | 9/10 | Discard |
| 4 | State conclusion, reasons, and evidence without the Minto name | 8/10 | Discard |
| 5 | Treat a complexity score as evidence, not as a target | 10/10 | Discard because it tied experiment 1 and added text |
| 6 | Shorten the Minto cue | 8/10 | Discard |

## Next test

Test this STE100 form with at least 3 runs for each arm:

```text
Use the Minto Pyramid: conclusion, reasons, and evidence.
```

Compare it with the canonical baseline and the full experiment 1 sentence. Keep it only
if it improves the mean strict score and does not move failures to another case.

The runner is `evals/autoresearch-cues/run.sh`. The `raw` directory contains all 70
solver answers. The `grades` directory contains both grader records for each experiment.
The runner did not record latency. This is a limit of this result.
