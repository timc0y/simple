# Every skills confirmation

## Decision

Do not change the Simple skill. With corrected sandbox paths, current and candidate
Simple both passed 4 of 4. A tie loses.

The earlier attempt reported 2 of 4 for current and 4 of 4 for the candidate, but it
used the stale isolation profile and is preserved under `grade-history/attempt-1` only
as contradictory evidence. The corrected rerun demonstrates why corpus tuning needs a
noise floor and pre-registered bar.

## Result

| Condition | Strict passes |
| --- | ---: |
| Current Simple | 4/4 |
| Reduced candidate | 4/4 |

## Method

Codex Luna and Terra each answered `instruction-review` and `proof-state` under current
and candidate Simple with repository, global skills, plugins, apps, hooks, rules, and
multi-agent support blocked. Codex Luna and Terra independently graded every anonymous
answer after accepting the known pass and rejecting the known fail. `candidate.diff` is
the exact candidate; the remaining files preserve both attempts.
