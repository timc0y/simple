# Representation clarification: 7 September 2026

Adopted the exact evaluated compatibility clarification locally. The candidate passed
6/6 decision cells; current Simple passed 4/6. Both conditions passed the four fresh
case cells. The difference was the known migration case: current added unnecessary
dual storage twice, while the candidate used the existing boundary twice.

| Decision task | Current r1 / r2 | Candidate r1 / r2 |
| --- | --- | --- |
| Internal property rename; API, reporting and storage unchanged | Pass / Pass | Pass / Pass |
| Two fixed, directly writable physical names for 90 days | Pass / Pass | Pass / Pass |
| Known migration with an old reader during overlap | Simplicity miss / Simplicity miss | Pass / Pass |

All twelve plans passed the frozen preservation criteria. The two misses concern
unnecessary maintenance, not observed data loss. These are manually reviewed plans,
not executed production migrations. [Manual verdicts](manual-review.json) retain both
axes and link to every submitted artifact. [Normalized results](results.json) require
both axes because each task asks for the smallest safe design.

## Change and adoption reason

Only `references/compatibility.md` changed. The clarification separates the internal
model, stored representation and published interface, asks whether an existing boundary
can translate for all real consumers, and requires a concrete incompatible requirement
before introducing another stored value. It also makes the example's storage-rename
requirement explicit rather than inferring it from an internal name change.

This makes an existing principle easier to apply at the point where the miss occurs.
The candidate preserves the exception: fixed consumers can require incompatible physical
interfaces. In both repeats of that control, it retained the two writable columns and
one transactional database synchronization owner, with changed-column conflict handling,
uniqueness checks and retirement. It did not replace real write compatibility with a read
alias. In the internal-only control it kept the schema and API unchanged.

The source-level reason for adoption is the distinction between the representation that
must change and those that can remain. The narrow repeated result supports that decision;
it does not establish a broad performance gain or zero regressions. No core skill text,
other reference, hook, installer or PR machinery changed. Both full skill versions remain
in [inputs.zip](inputs.zip), along with the tasks and protocol. No prior evidence was removed.

## Method

Twelve sequential solver calls requested `gpt-5.6-luna`, medium reasoning: three tasks,
two conditions, two repeats. Conditions alternate order between repeats. Two excluded Luna
preflight turns checked execution and resume. No Claude solver or model grader ran.
The exact returned model revision was not independently reported.

An independent Luna agent authored the two fresh cases without reading Simple, the
candidate or earlier answers. The lead selected the capability being tested, reviewed
criteria and pass/fail references, adapted presence verifiers to the existing harness,
and clarified normal read-committed visibility in the physical-name case before freezing.
This reduces answer leakage but is not an independent sample of typical user tasks.
The known case was already used during diagnosis; its improvement is not held-out evidence.
The fresh cases are PostgreSQL and TypeScript scenarios, still close to the representation
problem rather than evidence across unrelated product work.

The [protocol](protocol.md), both complete skill trees, prompts, fixture contexts, criteria
and runner were frozen before solver calls. The existing isolated behavior runner denied
repository/global-skill access and disabled plugin/hook discovery. The repository canary
and preflight passed; expected denied-global-skill startup warnings did not prevent local
assigned skill reads. [Reference commands and per-cell costs](costs.json) record retrieval
separately from outcomes. Skill reading was explicitly requested, so this does not test
natural activation. The candidate read compatibility in all six cells; current Simple
skipped it in one known-case repeat and read it in the other failed repeat. Thus the
result includes variation in reference selection and does not isolate wording under
identical retrieved context. No completed miss was retried, and the run stopped at
twelve cells.

The independent criteria are in [source-cases](source-cases/). Their simple executable
verifiers prove that a nonempty decision artifact exists, not that it is correct. Their
missing/empty/nonempty self-tests passed before solver calls. Original
[artifact-presence results](results-artifact-check.json) remain separate from semantic
verdicts. There were no invalid solver cells or post-answer rubric corrections in this run.

## Evidence limits

All plans require implementation-specific proof before execution. For example, exact
PostgreSQL upsert conflict targets, nullability, online migration sequencing and recovery
of writes accepted after cutover still need inspection in the actual repository. A passing
representation decision does not certify those operations. More lines, more tests or
more reference reads were not grading targets.

The earlier [investigation](../2026-09-07-migration-investigation/README.md) showed that
simply removing the example or forcing architecture reads did not reliably resolve the
miss. Its contradictory outputs remain. This run tests a different, explicit clarification;
do not combine the totals into one benchmark or claim the old example caused the failures.

## Reproduction

[inputs.zip](inputs.zip) contains `current-source`, `candidate-source`, `source-cases`
and the frozen protocol. Extract it into a new ignored record directory. From this
repository, run the public adapter with `freeze` and that directory as arguments, then
`measure` with `READY=1`. The [runner](run.py) reuses `evals/behavior/run.py` and requires
the existing macOS/Codex setup. Manually grade new decisions against the frozen criteria;
artifact presence alone is not a pass.

Public answers and artifacts replace local absolute paths with explicit markers. Full
events, preflight logs and the original adapter remain in the ignored local record.
The [manifest](manifest.json) preserves original hashes; its adapter hash refers to the
private original. The public adapter changes repository/record paths only. Runtime
adoption used the exact frozen candidate bytes. No release or installation occurred.
