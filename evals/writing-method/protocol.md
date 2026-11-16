# Request-derived writing checks

This is an authored synthetic case suite, not a model result. **0 paid API calls are
authorized for this work.** No solver or model grader has run, and no measured
behavior gain is claimed. The cases were developed beside the instruction change;
they are not held-out transfer evidence or private-session replays.

## Question and scope

Does the existing writing route perform the requested operation while preserving
meaning, relationships, evidence, and uncertainty? Does it repair a real writing
problem without imposing a final template, changing a limited edit's scope, or
rewriting already adequate text?

| Case | Operation and decisive distinction |
| --- | --- |
| `explain-relations` | Explain why a result follows; preserve which actor owns each quantity and action. |
| `shorten-condition` | Shorten while retaining a decisive condition even when the remaining sentences would still be true. |
| `compose-uncertainty` | Compose from notes; possibility stays conditional and unknown status stays unknown. |
| `improve-or-keep` | Repair unclear referents; leave an already adequate companion sentence alone. |
| `punctuation-only` | Fix punctuation without changing words, order, factual content, or output scope. |
| `correction-style` | Honor an accepted factual correction through a later style request. |
| `evidence-replacement` | Apply an explicit authoritative replacement while retaining unaffected facts. |
| `restructure-long-range` | Reunite a distant exception with its rule; preserve exact quote/code and each citation's claim. |

The correction and replacement cases supply ordered context in one prompt. They test
interpretation of that context, not actual follow-up turns, compaction, or native
delivery. Existing continuation evidence remains separate.

## Evaluator validation

Each case uses the existing `prompt.md`, `graders/criteria.md`, and
`graders/references/{pass,fail}.md` layout. Before any authorized model comparison,
the grader must accept the pass reference and reject the fail reference. It must also
accept the alternate valid paraphrase and reject the separate targeted failures where
provided. These extra references are calibration inputs, not solver context; the
shared runner's built-in self-test reads only `pass.md` and `fail.md`.

Review each decision against the supplied source and operation. A word inventory,
shorter answer, unchanged answer, or preferred opening does not establish success.
The same source can require different valid outputs for different operations. Check
omissions in one direction and unsupported additions or changed relationships in the
other. Preserve equivalent wording and valid no-op behavior.

The shared rubric is operation dependent. Freeze this rubric and the same case
criteria for every condition; historical scores under another rubric are not directly
comparable. Reject missing or invented candidate identifiers and non-Boolean
verdicts. Preserve grader disagreements and original grades; do not tune the contract
after reading a solver answer to turn a failure into a pass.

## Existing runner and gates

Use `evals/luna-cases.sh`, with `SUITE=writing-method` and these `CASES` values:

```text
writing-method/explain-relations
writing-method/shorten-condition
writing-method/compose-uncertainty
writing-method/improve-or-keep
writing-method/punctuation-only
writing-method/correction-style
writing-method/evidence-replacement
writing-method/restructure-long-range
```

`selftest` checks fixture presence and shell structure without calling a model.
The baseline for the proposed comparison is
`f315d12fe6855e9e17af561875f32d70dadb9a55`. Capture exact candidate bytes, revised rubric,
criteria, runner, and any invalid attempts before execution; a dirty-tree commit ID
alone does not identify the candidate.

Future execution requires explicit budget authority and confirmation of the selected
runner's actual spending enforcement, supported host/version, isolation canary,
model identity, and reference access. The current runner uses macOS `sandbox-exec`;
do not bypass that isolation on another host. Its input-token stop is not a
provider-level monetary cap. Count preflight, solver, follow-up, retry, and grader
usage together. This document grants no authority to set `READY=1` or call a model.

If execution is later authorized, preregister exact cells, repeated runs, the worthwhile
effect, total budget and stopping rule under `evals/README.md`. Compare the same Luna
model, host, tools, sources, rubric, and reasoning setting for no skill, baseline, and
one candidate. Establish the required identical-input noise control before claiming a
behavior gain. Grade operation success, semantic preservation and unsupported claims
before readability or concision. Inspect every baseline-pass/candidate-fail pair;
an improved total cannot cancel one. Stop at the registered bound, retain failed
outputs, and label a tie, ceiling or underpowered difference accurately.

Natural activation, actual continuation, reader comprehension and live host behavior
remain outside this suite. Deterministic checks of fixtures or runner paths establish
none of those capabilities.
