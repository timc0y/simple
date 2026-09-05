# Reconciliation lifecycle

## Decision

Ship the concrete completion rule. Current Simple passed 2 of 4 strict cells. The
candidate passed 3 of 4 and corrected completed-work cleanup on both Luna and Terra
without causing either model to delete unrelated context.

Do not ship the first generic reconciliation candidate. It passed 1 of 4 and is
preserved under `grade-history/attempt-1`.

## Result

| Condition | Strict passes |
| --- | ---: |
| Current Simple | 2/4 |
| Concrete lifecycle candidate | 3/4 |
| Rejected generic candidate | 1/4 |

The remaining candidate miss was grader disagreement. Luna accepted a no-change
handoff that Terra rejected for repeating supplied boundary facts. Neither grader
found unrelated cleanup or deletion.

## Method

Codex Luna and Terra each answered `completed-work` and `unrelated-context` under
current and candidate Simple with repository, global skills, plugins, apps, hooks,
rules, and multi-agent support blocked. Luna and Terra independently graded every
anonymous answer after accepting the known pass and rejecting the known fail.
`candidate.diff` is the shipped candidate. The first attempt retains its raw answers,
events, grades, map, normalized result, and candidate under `grade-history/attempt-1`.
