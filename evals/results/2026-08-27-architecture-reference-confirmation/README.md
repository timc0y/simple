# Architecture reference confirmation

## Decision

Keep the current architecture reference. Do not move the full Raptor account into
`examples.md`.

The first screen favored the shorter candidate by 7 of 8 to 6 of 8. Both Ponytail
arms passed 8 of 8. The different cell was a shared-parser answer with no relation to
the Raptor text, so the result needed a focused repeat.

The 3-run confirmation reversed the result. Current Simple passed all 12 strict cells.
The candidate passed 10 of 12. Both candidate failures weakened the condition for a
resident process in the startup case.

The edit removed duplicate prose, but it did not keep the behavior result. The
candidate stays in `evals/repository-work-shapes/architecture-reference-candidate.diff`
as a negative record.

## Method

Luna and Terra each solved the shared-owner and startup cases 3 times with current or
candidate Simple. Both graders first accepted each pass reference and rejected each
fail reference. A strict pass needs both graders to accept the answer.

The isolated harness blocked repository files, global skills, plugins, apps, hooks,
rules, user configuration, and agent support. `results.json` contains the normalized
record. The condition map, raw answers, and grader records are in this directory.
