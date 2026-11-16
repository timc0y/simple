# Jev decision models and agent harnesses

Research date: 21 September 2026. Question: what is Jev, what has been built on it,
and what could it change in Simple? Vendor capabilities, prices and benchmark
observations below are a dated research snapshot, not current verification.

Sources read in full: [TypeSafe AI](https://typesafe.ai) and its
[model docs](https://docs.typesafe.ai/models), [primitives](https://docs.typesafe.ai/primitives)
and [use-case map](https://docs.typesafe.ai/concepts/use-case-map);
[coldteadotai/abide](https://github.com/coldteadotai/abide), its
[replay benchmark](https://github.com/coldteadotai/abide/blob/master/benchmarks/replay/README.md)
and `packages/cli` and `packages/schema` source;
[y0usaf/pi-jev](https://github.com/y0usaf/pi-jev);
[Niaz Morshed, JCR](https://jcr.niazmorshed.dev/), 20 September 2026;
[LangChain, Building a Harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev).

## What the sources establish

### The model

Jev is TypeSafe AI's first System One model, released 15 September 2026. It returns
typed decisions instead of generated text: `noul` (the probability a statement is
true), `choice` (one option from a supplied set plus a distribution), and `score` (a
level on an ordered scale plus a distribution). Every answer carries a confidence
value. Input is text; context is 64k tokens; list price is $0.042 per million input
tokens with output tokens free; end-to-end latency is reported at 70 to 500 ms. The
vendor describes independent questions evaluated in parallel in one request; this
report does not measure how answer quality changes with batch size. The output space is closed, so the model cannot
invent an answer outside the supplied options. The vendor claims roughly 190x to 440x
faster and cheaper than a general model on decision tasks; the price is
vendor-stated and the vendor says it cannot prove it is not subsidised.

Accuracy, calibration and cost would all matter for Simple. Affordable per-turn
judgment is useful only when its decisions are reliable. Everything a harness could do with a calibrated
probability (thresholds, abstention, escalation, comparison) depends on the confidence
being real.

### The harnesses

- **abide** enforces repository instruction files that no linter can express. A compile
  step turns `AGENTS.md` and friends into `.abide/rubric.json`; each rule quotes its
  source line, carries a `scope` of globs, and runs at phase `edit` or `turn`. Model
  rules are sent to Jev one question per rule in one call per scope group; lint-shaped
  rules are recorded and never sent. Verdicts are normalised to a single violation
  probability whatever the question type, then banded: 0.8 and above tells the agent to
  repair, 0.5 to 0.8 is reported to the operator and explicitly not sent to the agent,
  below 0.5 is silent. `abide calibrate` scores every rule against about twenty real
  hunks from the repository history and switches off rules that never separate. Hooks
  run with retries at zero, hard timeouts of 8 s (edit) and 15 s (turn), bounded state
  (24k characters for a turn diff, 600 for the task), zero-data-retention requested,
  and a silent exit on every error path. The turn diff is a git snapshot taken at turn
  start; a hook that dies mid-snapshot leaves a detectable state and the turn is
  skipped rather than judged in part.
- **pi-jev** puts Jev in the Pi agent as a pre-call gate (destructive, exfiltration,
  beyond-scope as `noul`, impact as `score`), a post-call output judge (secret leak as
  `noul`, failure class as `choice`), and a `jev_ask` tool. Shadow mode is the default
  and every error path fails open. Thresholds were chosen from measured states: a
  requested `sed -i` edit scored 0.73 to 0.77 on destructive, so the threshold sits at
  0.90.
- **JCR** routes an agent's request to a deterministic operation (a CLI command or API
  endpoint) held in a plain-file capability tree. Jev sees only the direct children of
  the current node, chooses with a `none of these` option at every level, and the code
  combines the path probabilities with a geometric mean, keeps the top three, and
  reports ambiguity instead of guessing. The agent gets one tool and reads only the
  matched context.
- **LangChain** documents the same role in a general agent loop: Jev as the cheap
  decision step for routing, tool selection, and grading.

### What the evidence does and does not establish

- abide's replay replayed 93 real Claude Code sessions (1,256 edits, 147 turns) for 22
  cents. After independent review, edit-phase flags held up 10 of 39 (26 percent) and
  turn-phase flags 11 of 15 (73 percent). One turn in 13 ended with a confirmed
  violation of a rule no linter could express. Two edit rules produced most false
  positives. More turn-phase flags survived review in this sample; that does not
  establish reliability on Simple's tasks.
- The same benchmark shows violation rate does not rise with turn number; agents break
  these rules from the first edit at a steady rate.
- abide's README says the judge sees the rule and the diff and never the conversation.
  Its code sends the last user prompt as `state.task`, capped at 600 characters. The
  judge sees the current request, not the history.
- JCR's benchmark is 20 scenarios in two harnesses, one run each, concurrent, lookup
  only. It reports agent context and cost, not whether the resolver chose the right
  operation. With Opus 5, context fell about 85 percent and cost about 67 percent; with
  GPT-5.6-Sol, context fell about 23 percent and cost about 16 percent, and median wall
  time rose from 23.2 s to 45.4 s. One run made 193 Jev calls. Per-call latency did not
  compose into loop latency.
- None of the sources establishes that Jev's confidence is calibrated on this
  repository's tasks. That is the load-bearing unknown.

## How Simple maps onto Jev

Simple is a decision skill expressed as prose, with deterministic checks for its
profiles, packaging and host adapters. Its hooks supply context and reminders;
native host permissions govern tool access. The October authorization repair removed
the earlier permission parser and blocking guard. See the
[current decision and historical evidence](compaction-survival.md).
The candidates below are hypotheses about additional checks, not adopted behaviour.

Candidates to replace a heuristic or a named gap:

| Existing owner | Current form | Candidate Jev shape |
| --- | --- | --- |
| `scripts/hook.mjs`, `writingReminder` | Regex detects added comments or `.md` edits and supplies review guidance | `noul` against the `writing.md` comment rule. abide's comment rule confirmed 2 of 10, so turn phase or flag band only |
| `scripts/hook.mjs`, `authorizationReminder` | Configured patterns trigger advisory context; they neither grant nor deny permission | Historical candidate: a shadow comparison with the removed permission parser. It no longer replaces a current decision; native permissions remain independent |
| `evals/rubric.md` | Model graders can score four dimensions and a blocker; some runs instead use executable checks or manual review | `score` for actionability, completeness and concision; `noul` for the blocker. A candidate grader must first accept the pass reference and reject the fail reference; readability and factual claims still need appropriate review |
| `references/commands.md`, `simple check` | Validates profile shape and states that it does not verify whether claims are true | `choice` over the four claim classes in `references/profile-template.md`, plus `noul` for support by repository evidence |

Candidates to add a check that does not exist:

| Addition | Jev shape | Missing check it supplies |
| --- | --- | --- |
| Reconciliation content check | `noul` per truth owner: did this turn make this owner false? | `scripts/hook.mjs` supplies a post-edit reminder; it does not inspect the reconciled content or force another turn |
| Per-turn simplicity score | `score` with ordered levels and a `violatingFrom` level | A continuous series instead of a batch eval. abide's compile skill already drafts this question for "minimum code that solves the problem" |
| Stop-list questions | `noul` per trigger in `SKILL.md`, Stop and establish the missing fact | The stated-requirement capability measured 4 of 4 then failed to replicate; whether separate questions improve it is untested |
| Truth-owner contradiction | `noul` per pair of owner files | `repository-work.md:13` requires it; nothing enforces it |
| Swarm write scope | `noul`: did the turn write outside the assigned paths? | `repository-work.md:88` is prose only |
| Claim grounding | `noul`: does this claim something ran when the text shows it did not? | The preservation run invented release status despite retrieving the reference |

Rules that are not Jev-shaped and should not be given to it: the implementation ladder,
owner and ordinary-path discovery, fallback promotion, design-space comparison,
release sequencing, board and multi-lens synthesis, and operator emulation. These weigh
several independent factors and require novelty. A classifier could reject a valid
unusual decision; that risk needs its own check.

No model verdict would grant authority for deletion, release or another external
action. The conversation, repository contract and native permissions remain the
owners of those boundaries.

## Decision

No runtime change ships from this research. The record is a hypothesis and a falsifier.

The hypothesis: Simple's scarce resource is attention, and the failures that matter are
atomic decisions currently answered by keyword regexes, a general-model grader, or
prose. A calibrated decision model can answer those per turn at a cost that makes
per-turn judgment viable. It would be separate from the model that produced the
work. A closed output space restricts the available answers; it does not establish
calibration or prevent an incorrect finding.

The falsifier: run one node only. Take the reconciliation content check or the per-turn
simplicity score, calibrate it against this repository's own history, and test whether
its verdicts predict an actual correction better than the noise floor. If not, the
hypothesis fails at one node and cost cents. Two constraints hold whatever the result:
the first task is to show the confidence is calibrated on this repository's tasks, and
a high-probability verdict may never override a reasoned novel choice, because Simple's
value is the smallest truthful design, which is usually the surprising one.

## Not done

No calibration of Jev confidence on this repository's tasks. No measurement of whether
routed context beats injected context for agent output, which is the untested case
behind "inject fewer, better lines". No ablated comparison of any candidate above. No
live probe of the guard or the eval grader against a Jev verdict.
