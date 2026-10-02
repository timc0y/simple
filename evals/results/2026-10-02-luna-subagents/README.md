# New Simple with direct Luna sub-agents

Three actual `gpt-6-luna` sub-agents passed their initial tasks. After an identical
synthetic late hook message, none of the three final replies preserved the full
requested answer. The code remained correct: 26 independent assertions passed,
and the root reproduced all 10 smoke assertions.

| Case | Initial final reply | Reply after late feedback | Work evidence |
| --- | --- | --- | --- |
| Morning digest release decision | Pass | Fail: cleanup-only reply | Correct read-only production decision before continuation. |
| Photo tagging estimate | Pass | Fail: cleanup-only reply | Correct arithmetic, simple table and measured/assumed boundary before continuation. |
| Barcode lookup fix | Pass | Fail: owner inventory replaces concrete result and passing checks | 26 independent assertions, 10 smoke assertions; README accurate. |

## Decision

The new final-response sentence did not prevent answer loss in this screen. Keep
this failure as evidence; no instructions were retuned and no failed cell was
retried. This supports investigating late continuation as a delivery risk. It
does not establish its cause, a before/after improvement, or native hook/T3
rendering behavior. The source hook change removes Stop registration; this run
did not execute that native lifecycle or update any installed plugin.

## Method

Three fresh collaboration agents, requested model `gpt-6-luna`, medium reasoning,
`fork_turns: none`; one independent synthetic task each. Their first replies were
captured, then each received exactly [continuation.md](continuation.md) through
`followup_task`. This is a synthetic user-role hook message, not native Stop
feedback. It incorrectly assumes edits in both read-only tasks, exercising the
reported generic late-feedback problem.

The skill and all references were frozen before spawning in
[inputs/simple](inputs/simple/). They match the working source bytes, based on
main `3270463a94ec7367507b376303594e32b9162277` plus uncommitted candidate changes;
this is not a committed-release evaluation. The tasks and
[criteria](grading/criteria.json) were newly authored after instruction development
and before these answers. This is forced execution, not natural activation.

The root manually accepted known pass references and rejected known fail
references before spawning. The independent barcode verifier accepted a known
fix and rejected three targeted regressions. `npm run test:behavior` passed before
model work. The root checked the resulting fixture independently of the agent's
smoke tests. The agent's `git diff --check` ran inside an ignored fixture and did
not prove its formatting; root used `git diff --no-index --check` for that fixture.

The root reviewed actual final messages against the frozen contract.
[review.json](grading/review.json) retains criteria flags, four rubric scores,
blocker flags and supporting quotations. Initial readability scores were 4/5
in every case: each ended with unresolved state, an example or a check rather
than the next action. Two cleanup-only replies scored 5/5 for the rubric's
readability shape but failed completeness and the task verdict. A short,
readable reply can still lose the answer. No model grader was used; this is one
unblinded manual review with no repeat or variance estimate.

The three post-test [retrieval receipts](retrieval-receipts.json) report that each
agent read the frozen core and routed references. They are agent reports from
their own tool histories, not independently captured raw tool traces. The harness
kept shared native host instructions and full filesystem access. Graders were
outside the assigned scope and were not supplied to solvers, without enforced
filesystem isolation. Three unscored receipt turns followed the six performance
replies; they did not retry tasks or change their grades.

## Record and reproduction

[runner.json](runner.json) records the model, effort, context and tool sequence.
[answers](answers/) keeps all six raw performance replies. [cases](cases/) has
final fixtures and prompts; [inputs/barcode-before](inputs/barcode-before/) has
the initial code. [condition.json](condition.json) hashes every frozen skill file.
[results.json](results.json) follows the shared result schema.

To repeat in a delegation-capable host, copy the frozen skill and initial case
fixtures into a fresh private run directory, replace the explicit private-root
redaction marker in each prompt, and make the calls in `runner.json`. Keep grading
files outside solver scope. Follow up once with `continuation.md` after each
first final reply. Capture those replies without extra answer-preservation hints.

Run the independent artifact verifier with:

```sh
node verify-barcode.mjs cases/barcode
```

The original prompts and machine traces remain under ignored `.local/context/`.
Public files replace the private evaluation-root path with an explicit marker.
Model revision beyond the requested slug, per-agent latency, token use and billing
were unavailable. The earlier CLI evaluation used a different model and harness;
its counts must not be compared as a skill gain. No publishing, installation,
commit, push or changes to the Simple instructions occurred in this test.
