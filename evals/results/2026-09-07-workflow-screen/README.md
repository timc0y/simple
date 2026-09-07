# Workflow expansion screen, 7 September 2026

All three conditions passed both tasks after correction of an overconstrained verifier.
This is a small execution screen with an all-pass ceiling, not evidence that Simple
outperforms PStack, Ponytail or the previous Simple skill.

| Condition | Original executable grade | Corrected executable grade | Source-faithful writing |
| --- | --- | --- | --- |
| No skill | 1/2 | 2/2 | 1/1 |
| Previous Simple | 1/2 | 2/2 | 1/1 |
| Expanded Simple | 1/2 | 2/2 | 1/1 |

The [registered protocol](../../workflow/README.md) compared two tasks across three
conditions once, using sequential Codex Luna calls with medium reasoning.
The runner requested `gpt-5.6-luna`; the exact backend revision was not reported.
The six solver cells completed without a retry. The two-turn preflight is excluded.
The previous skill includes the first upstream integration, before this workflow expansion.

## Verifier correction

The original shared-failure verifier required the first timeout to exit nonzero.
The task also permits a caller to return an honest unknown result.
It also required unknown mode to leave zero effects, although the fixture writes
before returning unknown and the task never promises that unknown means no effect.
These were unsupported grading requirements, not demonstrated solver regressions.

The corrected verifier checks the real effect after the first timeout and after the
cross-entry retry, in both directions. Each must leave exactly one effect.
It accepts honest uncertainty without prescribing the first timeout's representation.
It rejects unrelated crashes and hung processes as proof of uncertainty.
The self-test accepts valid alternatives and rejects the original fault and a caller-only fix.

The correction regraded copies of the same completed artifacts. No solver answer was
rerun or changed. [Original grades](results-original.json), [original checks](verifiers-original),
[corrected grades](results.json) and [corrected checks](verifiers) remain separate.
The frozen archive retains the original verifier; [corrected-verifier.mjs](corrected-verifier.mjs)
records the regrade. This correction cannot establish a skill improvement.

The [corrected case archive](corrected-case.zip) keeps the complete fixture and
positive and negative self-tests. Extract it into a fresh scratch directory and run
`node selftest.mjs` there. The standalone corrected verifier accepts a fixture directory
as its first argument and an optional report path as its second argument.

## Scope and evidence

- Shared failure checks a synthetic file-backed operation, two entry points,
  distinct operation keys and preservation of an unknown status. It does not prove
  production exactly-once semantics, cross-process locking or crash recovery.
- Writing checks exact JSON fields. The [root prose review](writing-review.json)
  also confirmed source facts, rollback limits, unknown duration and no invented release status.
- [Retrieval commands](retrieval.json) show the candidate requested diagnosis and
  verification references for the bug task and writing guidance for the handoff.
  This is forced-read execution; commands can have truncated output and do not prove natural activation.
- [Cell records](cells.json) retain tokens, tool calls and latency as process data.
  One sample per cell does not support a cost or speed comparison.

Host logs reported blocked global skill discovery and system-skill installation warnings.
The isolation canary passed and the exec/resume preflight completed. The assigned
workspace skill was readable. These warnings did not establish a condition-access failure.
Private full traces remain local. Public [answers](raw) and [diffs](diffs) redact local
absolute repository paths; [artifacts](artifacts) contain the synthetic final files.

## Final composition

The source review subsequently added a direct type route, shared command routing,
issue-intake guidance and fixed-destination write safeguards. Those changes passed
structural checks but did not run through these six model cells.
[Post-freeze changes](post-freeze-changes.json) names the four affected runtime files.
Other workflows have source review and structural validation, not comparative execution evidence.
No global no-regression or superiority claim follows from this run.

[Frozen inputs](frozen-inputs.zip) contain both full skills, both cases and the runner sources.
[Manifest](manifest.json) records their hashes. For reproduction, restore the archived
runner sources and the selected skill into a separate checkout. Use a new record
directory, preserve the original results, and keep the original versus corrected rubric explicit.
