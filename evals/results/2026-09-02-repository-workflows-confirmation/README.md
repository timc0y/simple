# Repository workflows confirmation

## Decision

Do not roll out the full repository system yet. The candidate beat Git-`HEAD` Simple
5 of 12 to 3 of 12 with no paired regression, but it failed the pre-set release gate:
at least one deep-audit cell had to earn a strict pass, and none did.

The candidate guidance for init and reconciliation is supported directionally. The
deep multi-lens workflow remains experimental. Do not use this run to claim reliable
cross-model deep audits or to reconcile the existing product repositories at scale.

## Result

| Condition | Opus | Sonnet | Luna | Total |
| --- | ---: | ---: | ---: | ---: |
| Git-`HEAD` Simple | 1/4 | 1/4 | 1/4 | 3/12 |
| Candidate | 2/4 | 1/4 | 2/4 | 5/12 |

The stable gains were Luna init and Opus reconciliation. All six current and candidate
local finish cells passed. Neither condition passed a deep audit. Terra accepted the
Luna candidate audit that Luna rejected because its release-identity finding omitted
explicit falsification, smallest proof, severity, and action class.

The registered stopping rule required all three conditions: at least a 2-of-12 strict
gain, no paired regression, and one strict deep-audit pass. The first two passed. The
third failed, so no further prompt tuning or rollout followed.

## Method

Claude Opus 5, Claude Sonnet 5, and Codex Luna each ran four cases under Git-`HEAD`
Simple and the frozen candidate. The 24 cells used the same isolated tools, medium
Claude effort, default Luna reasoning, sequential execution, fixtures, timeouts, and
read/write boundaries. Codex Luna and Terra graded all anonymous answers after passing
their reference self-tests.

Claude solver calls cost $3.0067 for Opus and $1.2233 for Sonnet. Codex cost was not
exposed. This run did not test installation, release, deployment, live services,
devices, accounts, distribution, or a real multi-repository rollout.

`current-ref.txt`, `candidate.diff`, the exact runners and cases, raw answers, events,
errors, grades, mapping, and normalized results preserve the evidence.
