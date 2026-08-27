# Luna view

## Design

This clean Codex matrix has 96 valid outputs. It has two solver models, `gpt-5.6-luna` and `gpt-5.6-terra`, and 12 arms:

`none`, `pony`, `legacy`, `legacy-pony`, `first-principles`, `first-principles-pony`, `invariant`, `invariant-pony`, `counterfactual`, `counterfactual-pony`, `canonical`, and `canonical-pony`.

`mutation-interval` has repetitions 1 and 2. `production-data` and `future-service` have repetition 1. Each model has 48 outputs. The run has no missing cells. The read sandbox blocked global Codex skills. The raw, metadata, and event directories each contain 96 records.

The grade uses the three case rubrics. Response length is a cost measure, not a correctness measure.

## Rubric self-test

Each known pass reference passed its rubric. Each known fail reference failed its rubric.

| Case | Self-test |
| --- | --- |
| `mutation-interval` | Pass reference passed; fail reference failed. |
| `production-data` | Pass reference passed; fail reference failed. |
| `future-service` | Pass reference passed; fail reference failed. |

## Scores

| Case | Luna | Terra | Total |
| --- | ---: | ---: | ---: |
| `mutation-interval` | 24/24 | 17/24 | 41/48 |
| `production-data` | 12/12 | 12/12 | 24/24 |
| `future-service` | 10/12 | 12/12 | 22/24 |
| **All cases** | **46/48** | **41/48** | **87/96** |

The seven Terra mutation failures state a receipt check or refusal before lock acquisition. The two Luna future-service failures add `ReportService` and `InMemoryReportQueue` despite no measured load or independent lifecycle.

The following table gives pass counts for each arm across both models. The denominator is four for mutation, two for production, and two for future.

| Arm | Mutation | Production | Future | All |
| --- | ---: | ---: | ---: | ---: |
| `none` | 2/4 | 2/2 | 1/2 | 5/8 |
| `pony` | 3/4 | 2/2 | 2/2 | 7/8 |
| `legacy` | 3/4 | 2/2 | 1/2 | 6/8 |
| `legacy-pony` | 4/4 | 2/2 | 2/2 | 8/8 |
| `first-principles` | 3/4 | 2/2 | 2/2 | 7/8 |
| `first-principles-pony` | 4/4 | 2/2 | 2/2 | 8/8 |
| `invariant` | 3/4 | 2/2 | 2/2 | 7/8 |
| `invariant-pony` | 4/4 | 2/2 | 2/2 | 8/8 |
| `counterfactual` | 4/4 | 2/2 | 2/2 | 8/8 |
| `counterfactual-pony` | 4/4 | 2/2 | 2/2 | 8/8 |
| `canonical` | 3/4 | 2/2 | 2/2 | 7/8 |
| `canonical-pony` | 4/4 | 2/2 | 2/2 | 8/8 |

## Pair effects

Each pair below compares one model's arm with its `-pony` arm across the three cases. Each side has four outputs.

| Wording | Luna alone | Luna `-pony` | Delta | Terra alone | Terra `-pony` | Delta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `legacy` | 3/4 | 4/4 | +25 pp | 3/4 | 4/4 | +25 pp |
| `first-principles` | 4/4 | 4/4 | 0 pp | 3/4 | 4/4 | +25 pp |
| `invariant` | 4/4 | 4/4 | 0 pp | 3/4 | 4/4 | +25 pp |
| `counterfactual` | 4/4 | 4/4 | 0 pp | 4/4 | 4/4 | 0 pp |
| `canonical` | 4/4 | 4/4 | 0 pp | 3/4 | 4/4 | +25 pp |

These are observed pair differences, not causal estimates. The mutation rubric makes small ordering differences decisive, and the run has only two mutation repetitions and one repetition in each other case.

## Skill invocation and cost

An invocation count requires an event command that reads the local `SKILL.md`. A skill name in an agent message, or a skill listed by an arm, does not count as an invocation.

| Evidence | Trace files |
| --- | ---: |
| `simple` skill file read | 66/96 |
| `ponytail` skill file read | 34/96 |
| Both skill files read | 25/96 |

By model, `simple` was read in 39/48 Luna traces and 27/48 Terra traces. `ponytail` was read in 22/48 Luna traces and 12/48 Terra traces. Invocation was therefore not uniform within all labelled arms.

Across all outputs, the latency median was 31,350.5 ms and the output-token median was 1,248.5. The model medians were:

| Model | Latency median | Output-token median |
| --- | ---: | ---: |
| `gpt-5.6-luna` | 32,970.5 ms | 1,386 |
| `gpt-5.6-terra` | 30,506.5 ms | 1,191.5 |

The case medians were 34,162 ms and 1,370.5 tokens for mutation, 32,128.5 ms and 1,312 tokens for production, and 22,181 ms and 768 tokens for future service. Longer responses cost more tokens and time. They do not earn correctness credit.

## Recommendation and limits

Use the canonical ownership wording as the base. State the order as: acquire or recover the mutation lock, check the receipt while holding it, perform the mutation, durably record uncertainty, then release. State that receipt failure retains a blocking durable state. Require a real competing-process proof. For future growth, keep generation in the report module and name measured load or an independent lifecycle as the reconsideration trigger. Do not add a service or queue for a forecast alone.

The `canonical-pony` arm scored 8/8, but the trace evidence does not show uniform Ponytail invocation. This result does not establish that Ponytail caused the improvement. The pair results also do not establish a wording interaction. The matrix supports the recommendation as an evidence-backed wording choice, not as a statistically certain effect.
