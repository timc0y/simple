# Terra grade

I graded 90 valid raw answers. The rubric self-tests pass: every supplied pass reference passes and every supplied fail reference fails.

| Model | Passes | Valid | Median input | Median output | Median latency | Median turns |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| MiMo v2.5 free | 25 | 46 | 19,854 | 1,593 | 35.4 s | 5 |
| HY 3 free | 40 | 44 | 24,048 | 1,119 | 56.8 s | 4 |

The medians use only passed, valid answers. Across all valid answers, the pass rate is 65 of 90. Mutation interval passes are 31 of 44. Production data passes are 20 of 24. Future service passes are 14 of 22.

Missing or invalid cells total 6: four mutation-interval cells and two future-service cells. MiMo has 46 valid answers. HY 3 has 44. Muse Spark is excluded.

## Limits

This is not a clean baseline comparison. Eight event files read Simple from `/Users/tim/.config/opencode/skills/simple` despite the isolation flags. The affected labels include control and Ponytail labels. Do not interpret `none` or `pony` as clean treatment arms.

Labels also do not prove invocation. Exactly two event files called the Ponytail skill: `future-service__mimo-v2.5-free__pony__r1` and `future-service__mimo-v2.5-free__first-principles-pony__r1`. The other `pony`-labelled runs do not show a Ponytail invocation. This evidence cannot support a Ponytail interaction claim.

The evaluation also has uneven repetition. Mutation interval has two requested repetitions except four missing cells. Production data and future service have one requested repetition. The completion failures and global-skill leakage are material confounds.

## Recommendation

Do not select a leading-words variant or claim an arm effect from this matrix. HY 3 had the stronger observed score, 40 of 44, but the task arms were not isolated. Re-run the missing cells after preventing access to the global OpenCode skill, then verify each injected skill call from the event trace. Compare only runs with the intended skill invocation, and keep the same repetitions for every case.
