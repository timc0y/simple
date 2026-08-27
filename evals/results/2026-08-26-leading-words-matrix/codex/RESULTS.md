# Codex Luna and Terra results

## Decision

Keep the current canonical wording. Do not add another leading word.

The earlier paired test showed a useful behaviour change. This transfer run shows that
the wording works on Codex Luna and Terra. It does not isolate a winning phrase. The
strict dual-grader score is 6 of 8 for `legacy`, `first-principles`, `invariant`,
`counterfactual`, and `canonical` when each runs without Ponytail.

Do not claim that Ponytail caused an improvement. The combined arms scored well, but
Ponytail was directly read in only 34 of 48 cells where it was available.

## Run

The run used `gpt-5.6-luna` and `gpt-5.6-terra` as solvers. Each model produced 48
answers across 12 arms and 3 cases. All 96 cells completed. A macOS read sandbox blocked
the global Codex, agent, and plugin skill paths. Each run received only its project
skills and case fixture.

Luna and Terra then graded every answer independently. Each grader passed the known pass
reference and failed the known fail reference for all three rubrics.

## Scores

| Result | Passes |
| --- | ---: |
| Luna grader | 87/96 |
| Terra grader | 86/96 |
| Both graders pass | 79/96 |
| Graders disagree | 15/96 |
| Both graders fail | 2/96 |

The two shared failures are the Luna solver's `none` and `legacy` answers for
`future-service`. Both answers added a service and queue for forecast growth without
measured load or an independent lifecycle.

| Arm | Luna | Terra | Both pass |
| --- | ---: | ---: | ---: |
| `none` | 5/8 | 6/8 | 4/8 |
| `pony` | 7/8 | 7/8 | 6/8 |
| `legacy` | 6/8 | 7/8 | 6/8 |
| `legacy-pony` | 8/8 | 8/8 | 8/8 |
| `first-principles` | 7/8 | 7/8 | 6/8 |
| `first-principles-pony` | 8/8 | 8/8 | 8/8 |
| `invariant` | 7/8 | 7/8 | 6/8 |
| `invariant-pony` | 8/8 | 7/8 | 7/8 |
| `counterfactual` | 8/8 | 6/8 | 6/8 |
| `counterfactual-pony` | 8/8 | 8/8 | 8/8 |
| `canonical` | 7/8 | 7/8 | 6/8 |
| `canonical-pony` | 8/8 | 8/8 | 8/8 |

The graders disagree on 15 cells. Most differences concern the exact lock and receipt
order, whether a compatibility condition is sufficiently explicit, or whether asking
for repository evidence is enough to reject speculative infrastructure. Treat the
strict score as the conservative result.

## Invocation evidence

Simple was directly read in 66 traces. It was available in 80 cells. Ponytail was
directly read in 34 traces. It was available in 48 cells.

| Model | Simple reads | Ponytail reads |
| --- | ---: | ---: |
| Luna | 39/48 | 22/48 |
| Terra | 27/48 | 12/48 |

These are direct reads of the local `SKILL.md`. Arm labels do not count as invocation.
Global skill paths appear in no event trace.

## Limits and next test

This run tests available guidance, not guaranteed execution. It also has only two
mutation repetitions and one repetition for each control case. One-cell differences do
not establish an arm effect.

The next execution ablation must require a direct read of each intended skill before the
case prompt. Invocation discovery needs a separate run with implicit prompts. Add a
second repetition for production data and future service. Use nonce repository facts to
test knowledge that cannot come from model training.

Run the harness check with:

```sh
./evals/results/2026-08-26-leading-words-matrix/run-codex.sh selftest
```

The individual grader reports are in `LUNA.md` and `TERRA.md`. Their JSON records are in
`grades-luna/results.json` and `grades-terra/results.json`.
