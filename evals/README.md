# Simple evaluation protocol

Evaluate Simple as a decision skill. Do not grade preferred phrases.

## Start from intended capabilities

The requested capabilities define the requirements. Evaluations provide evidence
about their delivery; the current suite does not define the whole product. Preserve
accepted guidance even when its benefit is unmeasured. Do not remove it solely to
raise a score, shorten the skill or match a reference's benchmark.

Before an adoption decision, map the affected capability to its instruction, the
behavior the test actually exercises, and what remains untested. Keep three questions
separate: does the guidance express the intended decision, can the agent find and
apply it, and does the resulting work satisfy the task? None proves the other two.

Current coverage from the behavior and repeated preservation runs:

| Intended capability | Active guidance | Evidence and remaining gap |
| --- | --- | --- |
| Reduce custom implementation through worthwhile reuse. | Architecture implementation ladder; conditional examples. | Small fixtures test package/local/direct integration and cleanup. Prompts identify owners; they do not establish open-ended package discovery or replacement of substantial custom code. |
| Learn from SDKs, bundles, reference apps and upstream fixes. | Research reference. | No direct execution evaluation of upstream research, adopted behavior, attribution or intentional differences. |
| Let research find an existing solution that completes the task. | Core decision method; research reference. | No demonstrated discovery-to-completion case. The direct-code fixture has an input-domain ambiguity and cannot prove appropriate no-op behavior. |
| Promote a working fallback when it satisfies the full contract; retain useful recovery. | Architecture fallback guidance. | Synthetic cases exercise selection, cleanup, transient failure and uncertain writes. They do not establish performance across real environments. |
| Preserve unaffected requirements through corrections. | Core correction rule. | Actual follow-up turns exercise a narrow synthetic correction; broader session behavior remains untested. |
| Preserve facts and uncertainty in writing. | Core writing method; writing reference. | Prose review caught unsupported release-state claims missed by executable checks. Two repeats do not establish their cause. |
| Keep useful discoveries available for later work. | Core knowledge guidance; repository-work reference. | Prompted reference reads were observed. Natural activation and later-session reuse remain untested. |
| Surface a stated requirement that obstructs a materially simpler design, and keep it when a consumer makes it load-bearing. | Core stop trigger; architecture template field; plan and review contracts; worked example. | The [stated-requirement screen](results/2026-09-11-stated-requirement/README.md) passed 4/4 candidate against 1/4 current on two lead-authored cases, two repeats. The example was never read; natural activation, a tempting relaxation with a real consumer, and held-out tasks remain untested. |

Choose the next probe for a consequential coverage gap or observed failure. Use
separately authored tasks that require discovery without naming the desired solution,
and compare a case where reuse fits with one where it does not. Keep private session
sources local. Continue using Luna only for this repository's model evaluations.

## Compare equal conditions

The [workflow screen](workflow/README.md) checks shared-operation recovery and written
handoff fidelity after workflow expansion. It uses matched no-skill, previous and
candidate conditions. Treat its one-repeat result as a narrow screen, not broad improvement evidence.

Use the same model, harness, tools, repository state, and reasoning setting for each
condition. Compare no skill, the current skill, and one candidate on the same task.
When evaluating the value of the full skill, add a short-instruction control that
states its essential goal. This checks whether a sentence achieves the same result.
Add Ponytail alone for a direct reference comparison, or Simple with Ponytail when
skill interaction is the question. Freeze the exact text of every condition.

Test activation separately from execution. An activation run must not force the model
to read the skill. An execution run must make each model read its assigned skill.

## Check the requested outcome

For implementation tasks, prefer runnable fixture repositories and independent artifact
checks over grading an explanation of what the model would do. Exercise relevant failure
paths and preserved behavior. Check each verifier against a known fix and a targeted
regression before solving. Keep verifiers inaccessible to solvers.

Use actual follow-up turns when testing correction handling. Label synthetic adaptations
of past conversations as adaptations, and keep private source provenance local. Record
whether the test exercised activation, execution, continuation, or recovery; a written
scenario does not prove a live workflow.

Start new behavior probes from a concrete observed failure and its consequence. A
bug report naming one caller should still exercise affected sibling callers. Include
an already-simple task to catch unnecessary work. Keep some cases held out from
instruction development; repeated success on a known case is not transfer evidence.

Keep task completion separate from process cost: tool calls, latency, tokens, extra
edits, and unnecessary requests for user intervention. Compare source and test changes
separately. Less code earns credit only when the requested behavior is complete; a
nonempty diff or a compiling file cannot establish feature completion. Do not reject
correct behavior because the response did not recite an owner or use a preferred phrase.
An executable verifier is not a Luna or Terra grader; leave those grader fields absent.

For this repository, `npm run test:behavior` runs the existing verifier self-tests
without model calls. Run it before an executable evaluation.

## Prove the grader first

Each case must contain these files:

- `prompt.md`;
- `graders/criteria.md`;
- `graders/references/pass.md`;
- `graders/references/fail.md`;
- `SIMPLE.md` when repository facts affect the answer.

The grader must accept the pass reference and reject the fail reference. Reject the
run if this check fails. Keep grader files hidden from the solver.
Require the grader to return the exact anonymous identifier set and Boolean verdicts.
Reject missing, invented, duplicate, or placeholder identifiers.

Grade present obligations, ownership, lost facts, independent proof, unsupported
claims, mode errors, safety boundaries, and writing quality. Do not grade one
preferred implementation when more than one design satisfies the task.

## Keep a complete run record

Store each reviewed run in `evals/results/<date>-<name>/`. Keep the exact runner, raw
answers, grader records, condition map, and a short `README.md` with the decision.
Keep private tool output and machine traces in ignored `.local/` files. For a public
record, replace this content with an explicit redaction marker. Keep the original only
in `.local/`.

Active TSV runners must also call `evals/normalize-results.mjs`. This command writes a
`results.json` file that matches `evals/results.schema.json`. The normalized record
keeps each model and condition separate and points each task to its grading evidence
(the check output for executable cases), with the submitted answer also retained.

The [result index](results/README.md) marks each run as valid, superseded, invalid, or
inconclusive. Old runs can keep their first record format. Do not present an old record
as normalized if it does not match the current schema.

## Separate adoption from demonstrated improvement

Change one instruction at a time where possible. Run the current and candidate text
on the affected cases. Additional instruction earns a behavioral recommendation only
when relevant evidence supports the claimed benefit and its tradeoffs. A tie does
not establish a gain or show that an unexercised capability has no value. Record
owner-requested adoption and editorial consolidation separately, including missing
behavioral validation. Adoption can proceed without a demonstrated score improvement;
report observed failures and uncertainty without relabeling them as successes.

Record negative results. Do not change a grader after a model answer unless the task
contract was wrong. If you change the contract, state why and run the affected answer
again when the change can alter its grade.

Keep each earlier grade before you grade an answer again. If the same rubric gives a
different verdict, mark the grader as unstable. Do not use that verdict change as
evidence of a skill gain. Use a corrected contract, an independent manual review, or an
inconclusive result. Keep the contradictory evidence.

## Retune only above the noise floor

When claiming that a corpus or model adapter improves behaviour, first run two
byte-identical copies through the same harness to expose runner and grader variance.
Register the metric, worthwhile effect, repeated runs per case and condition, stopping
rule, and required workflow path before changing the corpus. A single run per case is
an initial screen. If all controls pass, report the ceiling; add harder held-out cases in
a separately registered run rather than extending the run until a gain appears.
A candidate must clear that observed noise; a tie or underpowered point estimate is
inconclusive, not improvement.

Keep workflow adherence separate from task outcome, and record which phases the probe
actually entered. A clean result cannot support a claim about an unexercised phase.

Run local Codex processes sequentially. Record host setup warnings. Reject a run only
when a warning changes condition access, inputs, outputs, or another equal condition.
Disable implicit system-skill discovery in isolated Codex runs. Copy only the selected
skill condition into the workspace.

Record the model revision, harness, reasoning setting, skill commit, token use,
latency, interventions, and limits when those facts are available. Never compare two
different model revisions and call the difference a skill gain.

## Preserve individual capabilities

Before shortening or relocating guidance, map each removed meaning to its surviving
instruction, example or check. Include reasons, exceptions and uncertainty. Restore a
missing obligation. Stored text is not proof that a model can retrieve it: inspect
reference reads and the resulting behavior separately.

Report previous/candidate results for every case and repeat. Any previous-pass and
candidate-fail pair requires individual review; a better total cannot cancel it.
Preserve the failed output and check evidence. Do not rerun away a completed failure.
Distinguish an observed output failure from evidence that a particular instruction
caused it. Check the task contract, grader, retrieved context and implementation before
choosing a fix. Repair the specific failure while preserving accepted capabilities.
Restore earlier wording when evidence supports that remedy; a paired failure alone
does not require a broad rollback. Record unresolved failures and the adoption reason.
A small all-pass sample does not guarantee zero regressions outside the tested cases.

## Reference implementation

Ponytail 4.9.0 at commit `974d940a1c5344210874150b98ff0d2c861fab6a` is the
reference for repeated comparisons, a short-instruction control, concrete failure
reproductions, and separate completion and maintenance measurements. See its
[agentic harness](https://github.com/DietrichGebert/ponytail/blob/974d940a1c5344210874150b98ff0d2c861fab6a/benchmarks/agentic/run.py)
and [comprehension/reuse results](https://github.com/DietrichGebert/ponytail/blob/974d940a1c5344210874150b98ff0d2c861fab6a/benchmarks/results/2026-06-22-issue-245-217-comprehension.md).

Reuse Simple's existing Luna runner, fixture checks, and result schema. Ponytail's
runner depends on Claude Code and blocks shell verification; Simple's execution
tasks need Codex, shell checks and actual follow-up turns. Its feature-size scorer
also treats a nonempty diff as correctness until a separate completeness review.
Keep independent behavioral checks here. This adapts the evaluation method; it does
not vendor Ponytail's code or establish a Simple performance gain.


The reference owns its published measurements; Simple owns its own result claims.
Reconsider the adapter when the host, tool access, continuation API or upstream scorer
changes. Compare the actual source contract before porting a new reference change.
