# Executable behavior screen — 6 September 2026

The old skill passed all five cases in both runs, and the overhaul passed all five.
No skill passed four. This screen found no completed-task improvement from the
overhaul and no observed task regression. It does not establish equivalence.

| Condition | Complete cases | Completed-run seconds | Input tokens¹ | Output tokens | Commands / file-change events | Source lines + / −² |
| --- | --- | --- | --- | --- | --- | --- |
| No skill | 4/5 | 211.1 | 388,117 | 8,392 | 23 / 9 | 17 / 9 |
| Old Simple A | 5/5 | 260.3 | 464,401 | 10,608 | 28 / 7 | 22 / 12 |
| Old Simple B | 5/5 | 338.7 | 672,503 | 11,838 | 39 / 8 | 22 / 12 |
| Overhaul | 5/5 | 244.3 | 537,991 | 9,814 | 24 / 7 | 18 / 12 |

¹ Input includes cached input; cache counts are in [metrics.json](metrics.json).
² Added/removed `.mjs` lines against the starting fixture, excluding installed
packages and injected instructions; this is a maintenance proxy, not lifetime cost.
Commands and file-change events are separate event types, not a complete tool-call
count. Edits made through shell commands are not necessarily file-change events.
Costs sum completed attempts only. Old B also had a 300-second timeout before its
successful retry, with no completed-turn token usage. Do not interpret that missing
usage as zero. The difference between the identical old copies cautions against an
efficiency claim from these single samples.

The sole failed obligation was [obsolete-file removal](checks/011648f83b04f22e.json)
in the no-skill fallback case. Its supported route, transient fallback and permanent
error behavior passed, but it retained `legacy.mjs` despite the cleanup request.

## What was tested

Each condition performed actual edits in five small runnable repositories:

- A real second-turn correction in the same session, preserving structured audit
  fields, queries and retention while changing a display summary. Both initial and
  final artifacts were checked.
- Selecting the supported implementation, retaining transient recovery, propagating
  permanent errors and deleting the obsolete path.
- Avoiding duplicate write effects across two callers after an uncertain response,
  while preserving genuinely unknown outcomes.
- Discovering an installed package and its example, using its API, and removing the
  displaced custom parser.
- A one-line heading change with existing upload behavior preserved.

Independent executable verifiers graded artifacts; no model graded prose. Known
working implementations and deliberate faults were checked before execution. The
model received the writable fixture and, where assigned, its skill snapshot; grading
code and other conditions were isolated. A preflight proved file writes, `npm test`,
and same-thread resume worked, while a protected-source read remained denied.
No unplanned user follow-up was supplied; the correction was the sole planned second
turn. No question-mark candidates appeared in completed agent-message events; this
is a trace screen, not an automatic intervention score.

All solver cells requested **gpt-5.6-luna, medium reasoning**. No Claude evaluations
were used. The exact resolved model revision was not reported.

## Decision and limits

The [registered rule](../../behavior/README.md) required at least two more completed
cases than either old copy, exceeding the old-copy difference, with no regressions.
The overhaul did not meet that gate. The two identical old copies tied at 5/5.

This measures more relevant behavior than a prose-only test, but the suite has a
ceiling: old Simple already completes every case. It supports a limited regression
screen, not a claim that the overhaul improves everyday work. The next independent
screen should use held-out, larger tasks with competing obligations and realistic
repository discovery; freeze them before running and do not tune this candidate to
these five answers.

These are synthetic adaptations of task shapes, not literal session replays. The
installed package is an authored local stand-in. This does not test live package
search, upstream maintenance, licensing research, the Webflow SDK, or a real reference
application. Skill loading was forced; automatic activation, long sessions and actual
production writes remain untested. Private conversation material is not included.

## Invalid attempts and retry

An initial attempt completed nine cells before setup issues were confirmed. All nine
were excluded and preserved privately with their exact source snapshot. Sandbox
ancestor metadata restrictions prevented ordinary `npm test`; the fallback fixture
also ambiguously described a legacy capability probe. A blind Luna review confirmed
that ambiguity. We corrected the sandbox and clarified the visible probe contract,
then reran all 20 cells. The Simple snapshots were unchanged.

During the clean run, old B's fallback cell (`89dc1ebde3bf10cd`) timed out after
300 seconds, following one completed command and then no completed turn. Its cause
is unestablished. State-database warnings appeared, but are not proof of the cause.
The attempt was archived and the same frozen input retried once successfully. The
completion table uses that retry; [metrics.json](metrics.json) records two attempts
for this cell. This exclusion limits reliability conclusions.

## Evidence and reproduction

- [Manifest](manifest.json): cell assignments, suite hashes and full skill hashes.
- [Normalized results](results.json): links to independent check outputs and answers.
- [Metrics](metrics.json): per-cell completed-attempt process measurements.
- [Frozen suite](suite.zip): exact registered prompts, fixtures, runner and verifiers,
  including the installed fixture package.
- [Submitted artifacts](artifacts.zip): final workspaces by cell ID, excluding injected
  instructions and Git internals.
- [Candidate patch](candidate.patch): overhaul against the skill directory at public
  commit `eb9a82f`. Apply with `git apply -p2` from a copy of that commit's
  `skills/simple` directory. Reconstruction was checked byte-for-byte against the
  frozen candidate.
- [Publication record](publication.json): explicit local-path redactions in exported
  text. Original events, invalid attempts and unredacted evidence remain local.

Suite archive bytes were checked against the frozen manifest. The public artifacts
preserve the submitted source; exported answers explicitly mark local-path redactions.
