# Luna results

> This OpenCode run has leaked global skills and six missing cells. Do not use it for
> causal claims. The clean Codex Luna and Terra result is in `codex/RESULTS.md`.

Luna graded 90 valid outputs from the leading-words matrix. The scores below are the Luna view. Terra must reconcile any different judgement.

## Design

The harness used 12 arms: none, pony, legacy, legacy-pony, first-principles, first-principles-pony, invariant, invariant-pony, counterfactual, counterfactual-pony, canonical, and canonical-pony.

The exact solver model IDs were `opencode/mimo-v2.5-free` and `opencode/hy3-free`. Mutation-interval had 2 repetitions. Production-data and future-service had 1 repetition. The six missing cells remain missing and are not failed:

- `mutation-interval__mimo-v2.5-free__pony__r1`
- `future-service__mimo-v2.5-free__canonical-pony__r1`
- `mutation-interval__hy3-free__invariant-pony__r1`
- `mutation-interval__hy3-free__first-principles__r2`
- `mutation-interval__hy3-free__invariant__r2`
- `future-service__hy3-free__canonical-pony__r1`

The 16 Muse Spark files were excluded. Their error logs show an external-directory permission request was rejected. This is a smoke-profile failure, not a solver grade.

## Rubric proof

The three known pass references passed and the three known fail references failed under the Luna rubric checks. The proof is recorded in `grades-luna/results.json`.

| Case | Result |
|---|---|
| mutation-interval | pass reference passed; fail reference failed |
| production-data | pass reference passed; fail reference failed |
| future-service | pass reference passed; fail reference failed |

## Scores

There are 60 passes and 30 fails among the 90 valid outputs.

| Case | Model | Score | Latency median (ms) | Output-token median |
|---|---|---:|---:|---:|
| mutation-interval | mimo-v2.5-free | 3/23 | 39753 | 1632 |
| mutation-interval | hy3-free | 19/21 | 75901 | 1281 |
| production-data | mimo-v2.5-free | 12/12 | 35230.5 | 1444 |
| production-data | hy3-free | 12/12 | 46592.5 | 1060.5 |
| future-service | mimo-v2.5-free | 7/11 | 33683 | 1252 |
| future-service | hy3-free | 7/11 | 39035 | 907 |

The model totals are 22 of 46 for MiMo and 38 of 44 for HY 3. The case totals are 22 of 44 for mutation-interval, 24 of 24 for production-data, and 14 of 22 for future-service.

The arm table is descriptive only. It compares each requested arm and includes the valid outputs available for that arm.

| Arm | MiMo | HY 3 |
|---|---:|---:|
| none | 1/4 | 2/4 |
| pony | 2/3 | 4/4 |
| legacy | 2/4 | 4/4 |
| legacy-pony | 1/4 | 3/4 |
| first-principles | 3/4 | 2/3 |
| first-principles-pony | 3/4 | 4/4 |
| invariant | 2/4 | 2/3 |
| invariant-pony | 2/4 | 3/3 |
| counterfactual | 2/4 | 4/4 |
| counterfactual-pony | 1/4 | 3/4 |
| canonical | 1/4 | 3/4 |
| canonical-pony | 2/3 | 3/3 |

Response length is a cost signal, not a correctness signal. Across valid outputs, the latency median was 41954 ms and the output-token median was 1248.5.

## Trace evidence and limits

Trace inspection found 62 Simple skill invocation records in 31 valid event files. It found 4 Ponytail invocation records in 2 event files: the Mimo future-service pony and first-principles-pony repetition 1 runs. The two files account for the 4 records.

The none and pony arms were not clean baselines. Trace evidence shows that these arms could load the global Simple skill at `/Users/tim/.config/opencode/skills/simple`. Ponytail was also absent from almost all arms labelled with Ponytail. Therefore this matrix does not establish a causal effect for wording, Ponytail, or their interaction. The descriptive arm scores must not be read as treatment estimates.

There were only 2 repetitions for mutation-interval and 1 for the other cases. Do not claim statistical certainty. The grader labels are human judgements against supplied criteria, not production outcomes.

## Luna recommendation

Use wording that states the required invariant, names one existing owner, gives the order of acquire, dead-holder conversion, receipt rejection, mutation, durable recording, and release, fails closed when recording fails, and proves the boundary with real competing processes and forced termination. For future-service, state the measured-load or independent-lifecycle trigger and keep the report module in process.

This is a content recommendation supported by the rubric and the pass reasons. It is not a causal claim that one matrix arm is best. Rerun the matrix with isolated none and pony baselines and a verified Ponytail invocation before selecting a wording variant from score differences.

## Validation

The Luna JSON contains exactly 90 grades: 46 MiMo and 44 HY 3. It contains one grade for each non-Muse raw output and no grade for the six missing cells. JSON parsing, count checks, and the facts in this report were validated after writing.
