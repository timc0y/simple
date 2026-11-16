# Request and source check: implementation verification

16 November 2026. Owner-requested method change, deterministic evaluator repair and
one synthetic forward task. **No measured model-quality improvement.** The
[protocol](../../writing-check/protocol.md) preceded the solver task and set zero
paid API evaluation calls and at most two collaboration turns per forward task.

## Reconciled final state

This follow-up is based on the separately created draft PR 2 at
`5032a8688a51ff5c3af73bee67ea836db5274ccd`; it preserves that draft's work and records.
The final combined source passes **82 tests**, the complete-profile check, skill
validation, shell syntax and whitespace checks. The existing runner's offline
`selftest` confirms all **eight** cases in the single `writing-method` suite.
Those are fixture/contract checks, not model grading.

The incoming operation-aware core/rubric, solver read denials, nested artifacts and
CI dependencies remain. This follow-up adds strict result normalization and retained
order validation through one grading helper, plus the consolidated conditional
writing reference. Final model use is not inferred from the earlier smoke below.

The separate final integration reviewer found no blocker in the reconciled scope,
independently passing ten evaluator integrity tests and the profile check. It checked
the operation-aware method and retained solver boundaries as well as malformed-result
rejection. This is a source/contract verdict, not a semantic-grader accuracy claim.

The follow-up commit uses `[skip ci]`: the existing GitHub workflow installs a plugin
into a scratch Claude configuration, and the user's instructions prohibit plugin
installation. No workflow is disabled or rewritten to conceal a result. Final-head
remote CI/load checks remain unrun; local checks above are the verification evidence.
The parent draft's recorded CI attempt remains separate historical evidence.

## What ran before reconciliation

- `npm test`: **80 passed**, no failures or skips. The remote baseline passed 73.
- `node skills/simple/scripts/simple.mjs check --context`: ready, complete repository
  profile, no failures. Its own `hostDelivered` and `modelApplied` values are null.
- Installed skill-validator script against the repository skill: passed.
- `zsh -n evals/luna-cases.sh` and `git diff --check`: passed.
- Independent focused review: all malformed/order-disagreement reproductions reject
  before result output; matching orders still normalize. The eight focused integrity
  tests pass. No model grader was invoked.

The instrument checks cover frozen source/alternate prompt delivery, exact candidate
sets, true Boolean verdicts, malformed scores, missing and invented records, resume
identity, both-pass/both-fail results and retained order disagreement. The independent
review first found a false success after disagreement, then malformed retained
records that still completed. The final guard parses one object, validates its shape
and recomputes agreement from both original verdict files. These were real failed
intermediate checks, not successes inferred from passing unit tests.

## Forward task

An independent helper authored a handoff task. A fresh collaborator requested as
`gpt-6-luna`, medium reasoning, received the task and explicit repository skill path.
One draft used 85 whitespace-separated words, below the 100-word bound. It retained
the local change, 12 fixture checks, no deployment, named responsibilities,
conditional rerun, missing-receipt branch and unknown duration. The lead and task
author reviewed it against the source.

The wording “Omar **should** send” is softer than the source's assigned “Omar sends”.
It can express a duty, so the task author recorded possible weakening rather than
an unequivocal role reversal. The original answer remains unchanged. The exact task,
output, hashes and boundary are in [handoff.json](handoff.json). The task author did
not save or hash an acceptance checklist before generation; this is independent
task-based review, not preregistered semantic scoring.

Communicator's separate synthetic task exposed a supplied sender-name omission caused
by its existing email signature ban. Its owner-specific repair and initial/final
evidence are recorded in that repository. Neither product imports the other.

## What this does not establish

The eight new writing cases are development fixtures, not model-graded performance
results. The forward task has no matched baseline, baseline repeats or reader study.
No general fidelity, personal-voice or comprehension gain is established. Exact model
revision and collaborator usage were not exposed; unknown usage is not zero usage.

The later same-day reconciliation uses the incoming core's operation-aware defaults
and a combined writing reference. The task's frozen hashes therefore identify the
earlier candidate, not the final reconciled skill; no new model task was launched.

Local assembly and explicit task routing do not prove natural activation or installed
delivery. The session-exposed Simple skill has SHA-256
`d7bd9a2cf910b4c13725db6c68059603870c28771522c968bd828e6fac7791fc`,
which differs from the repository candidate recorded in the task. It was not updated.
This Linux executor lacks the native macOS `sandbox-exec` path. OpenCode, Claude Code,
Codex and Antigravity installed workflows, live compaction survival and native model
isolation remain unverified. No release, installation or paid API evaluation ran.
