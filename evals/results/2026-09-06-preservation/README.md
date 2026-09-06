# Repeated preservation evaluation — 6 September 2026

The candidate passed the executable checks but added an unsupported release-state
claim in both writing repeats. The previous core and writing reference were restored
byte-for-byte. New worked examples, research and evaluation infrastructure remain.
This is a conservative response to an observed regression, not proof of its cause.

| Condition | Executable checks | Source-faithful writing | Complete cases including prose |
| --- | --- | --- | --- |
| Previous pre-consolidation overhaul | 12/12 | 2/2 | 12/12 |
| Consolidated candidate with new examples | 12/12 | 0/2 | 10/12 |
| Short instruction | 11/12 | 2/2 | 11/12 |

Six cases ran twice in each condition: 36 sequential Luna cells, with counterbalanced
condition order. No solver cell timed out or was retried. All six correction cells
used an actual second turn in the same thread. The two-turn preflight is excluded.
Solvers requested `gpt-5.6-luna`, medium reasoning; exact model revision was not
reported. No Claude evaluation was used.

## Individual failures and decision

- Candidate writing, repeat 1: “Release `v2.4.0` has not been completed.”
- Candidate writing, repeat 2: “Release `v2.4.0` has not been deployed.”
- Short instruction, fallback repeat 1: left `legacy.mjs` after fixing the supported
  route, transient fallback and permanent-error behavior. Those runtime checks passed.
  Its second repeat completed cleanup.

The writing source supplies version, commands, rollback boundary and an unknown
migration duration. It does not establish current deployment state. Both candidate
notes preserved the listed facts, but added unsupported status. Root source review
and a blind Luna review of anonymous outputs agreed. Previous and short notes
preserved the uncertainty. No wording-specific prohibition was used to score this.

The [registered protocol](../../preservation/README.md) requires review of every
preservation obligation, including prose. The [supplementary review contract](manual-review-contract.md)
was recorded before any writing cell completed. One initial Luna review mistakenly
used the root repository profile; that review was rejected and repeated using the
exact fixture profile. The rubric and solver outputs were unchanged. See
[writing review](writing-review.json) and [individual failure review](failure-review.json).

The candidate's smaller process measurements do not cancel the lost source fidelity.
The earlier `SKILL.md` and `references/writing.md` are restored; exact hashes and the
scope of retained changes are in [restoration.json](restoration.json). The final tree
combines those restored files with the new examples. It has not had a separate full
model run; the results above refer to the frozen conditions, not that final composition.
No global no-regression, causal or superiority claim follows from two repeats.

## What the cases establish

- `correction-preserves`: actual follow-up correction while preserving structured
  audit data, queries and retention; both initial and final artifacts checked.
- `fallback-selection`: supported route, transient recovery, permanent errors and
  removal of the obsolete implementation.
- `reuse-package`: integrate the explicitly selected installed package, preserve its
  bytes and remove displaced code. Varied inputs and an instrumented copy check use.
- `reuse-local`: use the designated unchanged local helper; varied inputs and an
  instrumented copy check delegation and cleanup.
- `reuse-direct`: dependency-free label transformation, including changed inputs and
  acceptance of a semantically equivalent loop. Its seed already handles the supplied
  ASCII labels, but the prompt describes ASCII operations without restricting the
  input domain. Agents reasonably tightened non-ASCII behavior, so this does not
  establish avoidance of unnecessary edits or a pure no-op control.
- `writing-context`: obtain facts from the fixture profile, produce the requested JSON
  and a faithful operator note. JSON checks and semantic prose review are separate.

All four full-skill writing cells successfully read both `references/writing.md` and
the fixture `SIMPLE.md`; both short-control cells read the profile. The candidate's
failure therefore was not simply an absent reference read. This is prompted retrieval:
the harness asks for the assigned entrypoint and its routed references. It does not
establish automatic activation. Read evidence is recorded in [metrics.json](metrics.json).

These are small synthetic adaptations of concerns expressed in the design discussion,
not literal session replays or independent held-out tests. Reuse contracts explicitly
select the owner, so the cases test integration and preservation more directly than
open-ended discovery. The package is an authored local stand-in, not live upstream
software. No live package search, Webflow SDK integration or production write is tested.
The [research record](../../../research/simple-skill-ideas.md#preservation-and-reference-led-development--6-september-2026)
retains hypotheses and their limits; original conversation provenance stays local.

## Process measurements

| Condition | Seconds | Input tokens, including cached | Output tokens | Command executions / file-change events | Source lines + / − | Test lines + / − |
| --- | --- | --- | --- | --- | --- | --- |
| Previous | 629.5 | 1,325,467 | 24,913 | 72 / 15 | 39 / 24 | 10 / 2 |
| Candidate | 607.4 | 1,272,406 | 23,650 | 64 / 15 | 32 / 23 | 9 / 2 |
| Short | 494.0 | 877,184 | 18,244 | 53 / 15 | 36 / 20 | 6 / 1 |

These are sums over 12 cells per condition, not efficiency estimates. Source/test
line changes count `.mjs` files, with conventional test names and directories classified
separately; installed packages and injected instructions are excluded. The line count
is a limited maintenance proxy. Command and file-change events are distinct and do not
cover every possible tool event. Shell edits need not emit file-change events.
Cached token counts and per-cell data are retained. No monetary-cost estimate is made.

## Evidence and reproduction

- [Manifest](manifest.json) and [condition map](mapping.tsv): frozen input hashes and
  all case, condition and repeat assignments.
- [Final results](results.json), [TSV](results.tsv) and `checks/`: combine executable
  checks with the required prose review. Only writing cells have Luna grader verdicts.
- [Executable-only results](executable-results.json) and [TSV](executable-results.tsv):
  original instrument grades, preserved before the prose review is combined.
- [Suite archive](suite.zip): exact frozen fixtures, prompts, verifiers and adapter.
- [Frozen inputs](frozen-inputs.zip): both complete skill snapshots, imported base
  runner and source snapshot. These bytes were verified against the manifest.
- [Submitted artifacts](artifacts.zip): final files by anonymous cell ID, excluding
  Git internals and injected skill instructions. Answers are in `raw/`.
- [Candidate patch](candidate.patch): previous to tested candidate; apply with
  `git apply -p2` inside a copy of the previous skill directory.
- [Publication record](publication.json): explicit redactions of local paths in text.
  Raw events, original traces and private provenance remain local.

The adapter reuses `evals/behavior/run.py` with macOS sandbox isolation and Codex.
Its preflight demonstrated writes, `npm test` and same-thread continuation while a
protected-source read failed. For reproduction, use the archived suite and base runner,
place `previous-skill` at `.local/behavior-eval-2026-09-05/frozen/candidate-skill`, and
use the archived candidate as `skills/simple`. Start with a fresh private run directory
and follow the suite's preregistration and execution commands. The archives support
source reconstruction; model revision and host differences can change outcomes.

After all 36 solver cells finished, an export-link correction briefly changed the
live adapter and relaxed two source-hash checks. The exact frozen adapter was restored;
the export correction is separate from model execution and retained privately. Public
archives use the verified original frozen bytes. No solver cell ran with that patch.
