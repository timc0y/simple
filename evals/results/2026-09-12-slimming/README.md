# Slimming preservation: 12 September 2026

No regression. The six preservation cases, two repeats each, passed in every cell for
both the previous skill at `c28f3b7` and the slimmed candidate: 24 of 24 successes,
verifier-checked, no retries, no invalid cells. Manual review of the `writing-context`
release notes found both conditions preserving every release fact and stating no
release status; the candidate's note is one sentence shorter and equally complete.

| Case | Previous r1 / r2 | Candidate r1 / r2 |
| --- | --- | --- |
| correction-preserves | Pass / Pass | Pass / Pass |
| fallback-selection | Pass / Pass | Pass / Pass |
| reuse-package | Pass / Pass | Pass / Pass |
| reuse-local | Pass / Pass | Pass / Pass |
| reuse-direct | Pass / Pass | Pass / Pass |
| writing-context | Pass / Pass | Pass / Pass |

## What the candidate changed

Against `c28f3b7`, the frozen candidate differs in five files: the core skill (round
routing, report-once sentence, and the debug-spiral trigger that was removed again
after the readable-rules run), the operator template, the writing reference (list
cap, failure shape, inspection-is-not-execution), the model-profiles reference (tier
names replaced by capability and consequence), and the repository-work reference
(literal proof labels replaced by the substantive distinction). The command files
were also cut to entry points, but they sit outside the skill directory and are not
exercised by this runner. The shipped skill equals the frozen candidate minus the
debug-spiral line.

## Method

`evals/slimming/run.py` wraps the preservation adapter, which wraps the frozen
behavior runner: isolated Codex workspaces, `gpt-5.6-luna`, medium reasoning,
executable verifiers, forced skill read, and the two-turn correction case. The
"short" control condition was dropped; only previous and candidate ran. The record
here holds the manifest, per-cell status, raw answers, verifier outputs, and diffs
with local paths replaced by markers. Events, snapshots, and workspaces stay in the
maintainer's local record.

## Limits

Two repeats on six fixtures prove preservation of those behaviours, not that the
slimmed text reads better or that the removed command prose was never load-bearing.
The command files' change is covered by structural tests only.
