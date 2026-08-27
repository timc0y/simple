# Terra grade

All 96 raw outputs are valid and graded. The three rubric self-tests pass. Each pass reference passes. Each fail reference fails.

| Model | Mutation interval | Production data | Future service | Total |
| --- | ---: | ---: | ---: | ---: |
| GPT 5.6 Luna | 23/24 | 10/12 | 6/12 | 39/48 |
| GPT 5.6 Terra | 24/24 | 11/12 | 12/12 | 47/48 |
| Total | 47/48 | 21/24 | 18/24 | 86/96 |

## Arm results

Each arm has 8 cells. A pair has the same wording with and without Ponytail.

| Arm | Passes | Ponytail pair | Passes | Pair effect |
| --- | ---: | --- | ---: | ---: |
| none | 6/8 | pony | 7/8 | +1 |
| legacy | 7/8 | legacy-pony | 8/8 | +1 |
| first-principles | 7/8 | first-principles-pony | 8/8 | +1 |
| invariant | 7/8 | invariant-pony | 7/8 | 0 |
| counterfactual | 6/8 | counterfactual-pony | 8/8 | +2 |
| canonical | 7/8 | canonical-pony | 8/8 | +1 |

The counterfactual pair has the largest observed difference. Its plain arm fails twice on Luna. Its Ponytail arm passes all 8 cells. The other pair effects are one cell or zero.

## Trace and cost evidence

The harness made Simple available in 80 cells and Ponytail available in 48 cells. The read sandbox blocked global Codex and agent skill paths. This prevents the earlier global-skill leak.

Availability did not prove use. A parent trace check found 66 direct reads of the local
Simple skill and 34 direct reads of the local Ponytail skill. Luna read Simple in 39 of
40 available cells and Ponytail in 22 of 24 available cells. Terra read Simple in 27 of
40 available cells and Ponytail in 12 of 24 available cells. Counts refer to direct
reads of the local `SKILL.md`, not arm labels.

| Model | Median input tokens | Median output tokens | Median reasoning tokens | Median latency |
| --- | ---: | ---: | ---: | ---: |
| GPT 5.6 Luna | 46,229 | 1,386 | 562 | 33.0 s |
| GPT 5.6 Terra | 48,974 | 1,192 | 501 | 30.5 s |

The medians use all 48 valid outputs for each model.

## Limits and recommendation

This matrix is complete and blocks global skills, but it does not force local skill use. Therefore, an arm effect mixes wording, available files, and whether the model read them. Future-service has only one repetition per arm. The small cell counts also make the one- and two-cell pair effects unstable.

Use `counterfactual-pony` as the next wording candidate. It is the only pair with a two-cell advantage and it passes all 8 cells. Before selecting it, rerun with trace-verified reads of the intended skill in every relevant cell. Keep the two mutation repetitions and add a second repetition for production data and future service.
