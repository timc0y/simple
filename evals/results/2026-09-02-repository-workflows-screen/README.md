# Repository workflows screen

## Decision

Treat the candidate as a directional improvement, not as a release result. It passed
5 of 12 strict cells. Git-`HEAD` Simple passed 2 of 12 and no skill passed 3 of 12.
No current-Simple pass regressed, but no candidate deep audit earned both graders'
approval.

The reliable candidate gains in this screen were Luna init, Sonnet local finish, and
Opus reconciliation. The separate confirmation decides whether they survive another
model run.

## Result

| Condition | Opus | Sonnet | Luna | Total |
| --- | ---: | ---: | ---: | ---: |
| No skill | 1/4 | 1/4 | 1/4 | 3/12 |
| Git-`HEAD` Simple | 1/4 | 0/4 | 1/4 | 2/12 |
| Candidate | 2/4 | 1/4 | 2/4 | 5/12 |

The candidate passed all three local finish cells, Luna init, and Opus reconciliation.
Deep audit was 0 of 3 strict. Luna accepted the Opus audit that Terra rejected.

## Method

The final 36-cell record combines an exact no-skill and Git-`HEAD` control run with a
frozen candidate run under the same fixtures, model pins, tools, reasoning settings,
timeouts, and sequential harness. All 36 answers were then graded together under
opaque IDs by Codex Luna and Terra. Both graders accepted every known pass and rejected
every known fail.

The models were Claude Opus 5, Claude Sonnet 5, and Codex Luna. Claude solver calls in
this record cost $4.4041 for Opus and $1.6314 for Sonnet. Codex cost was not exposed.

Earlier diagnostics found and corrected a Claude task-notification extraction bug and
two grader-contract errors before this decision run. Regrading changed one no-skill
reconciliation verdict, so no-skill comparison is noisy. Current-Simple and candidate
verdicts were stable across their separate and shared grading contexts.

`current-ref.txt` identifies the control source. `candidate.diff` preserves the tested
skill changes. `workflow.sh`, `harness.sh`, `cases/`, raw answers, events, errors,
grades, mapping, and normalized results preserve the remaining evidence.
