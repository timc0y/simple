# Migration miss investigation: 7 September 2026

The earlier miss was real, but this follow-up does not support blaming the new
example or rolling it back. Keeping the example produced the smaller design in
3/4 diagnostic runs; removing it produced that design in 0/4. This is a small,
known-case screen, not proof of general improvement or a reliable causal estimate.

| Example | Reading instruction | Smaller design, r1 | Smaller design, r2 | Total |
| --- | --- | --- | --- | --- |
| Removed | Normal reference selection | Miss | Miss | 0/2 |
| Retained | Normal reference selection | Pass | Pass | 2/2 |
| Removed | Explicit architecture read | Miss | Miss | 0/2 |
| Retained | Explicit architecture read | Pass | Miss | 1/2 |

All eight plans retain the stated data, API and old-worker obligations and discuss
verification, recovery and the compatibility exit. This is a review of proposed
plans, not proof that their migrations work in production. Five plans add unnecessary
stored state and synchronization. [Manual verdicts](manual-review.json) keep those
outcome dimensions separate; [normalized results](results.json) include simplicity
because the task explicitly asks for the smallest workable migration.

## What the investigation established

The requirement changes an internal name. It does not require the new worker to
address a physical column with that name during the overlap. The existing column
can remain the single source of truth while a database boundary exposes it as `label`.
The old worker keeps its unchanged query and the HTTP serializer keeps `item_title`.

A small [SQLite proof](storage-proof.py) exercises the unchanged old read, the new
internal name, a new-build write and the unchanged API response with one stored title
value. It passed. This establishes the feasibility of the simpler alternative;
it does not certify a production migration, backup or concurrent deployment procedure.

The unsuccessful answers assume that changing the new build's internal vocabulary
requires adding the new physical column immediately. They then introduce synchronization
to satisfy the old worker. The successful answers separate those choices. This is an
observable reasoning difference, not a proven account of the model's internal cause.

The original successful previous-Simple answer read architecture, while the failed
current answer did not. That was a plausible retrieval hypothesis. The follow-up
weakens it: architecture was read in both successful and unsuccessful runs, including
both explicitly instructed conditions. It was also selected naturally in one normal
run of each example condition. This experiment tests the instruction to read architecture;
it does not isolate architecture exposure from total absence. See [read paths and costs](costs.json).

The first normal repeats reversed the original outcome: removing the example missed,
retaining it passed. Removing the example is not a reliable remedy. Adding a mandatory
architecture read did not improve either condition in this sample. Do not infer that
architecture is harmful from one extra miss either.

## Method

Eight sequential runs requested `gpt-5.6-luna`, medium reasoning. The exact returned
model revision was not independently reported. Four conditions ran twice on the same
migration task, with condition order rotated for the second repeat. This is a small
factorial diagnostic, not a full order-balanced or statistically powered study.

Both skill trees are the current full skill. Only the compatibility example was removed
in the without-example tree; the delivery changes and all other files were held constant.
Thus without-example is a diagnostic variant, not the full previous version used in the
original three-task screen. Do not pool their totals as if they were identical conditions.

The normal arms use the existing forced-skill and routed-reference instruction. The other
arms additionally request an architecture read without naming the expected design. The
[protocol](protocol.md), [criteria](criteria.md), task and complete skill trees were frozen
before calls. The manual pass and failure distinctions were specified in advance.
No solver received grading files or the SQLite proof. No completed miss was retried.

The existing isolated behavior runner supplied the sandbox, canary, local execution,
resume preflight and artifacts. Two excluded Luna preflight turns passed. Global skill,
plugin and hook reads were disabled or denied; the canary rejected repository reads.
Expected denied-global-skill startup warnings did not prevent local assigned skill reads.
No Claude solver or grader ran. The executable case verifier proves artifact presence
only; [its original results](results-artifact-check.json) are retained separately from
manual semantic verdicts. There were no invalid solver cells.

## Decision

Keep the current skill and the example. Preserve the original failed answer and this
contradictory follow-up. The narrow failure worth watching is unnecessary duplicated
state caused by conflating an internal model with its storage representation. The
existing implementation ladder already asks agents to reuse the ordinary path and
remove synchronization duties. More instructions are not yet an evidenced remedy.

A later improvement should make that existing distinction easier to apply across
unrelated representation changes, and demonstrate transfer on cases where a boundary
mapping fits and where it cannot meet a real requirement. This run does not justify
adding PR machinery, a mandatory reading sequence or another skill.

The earlier 2/3-versus-3/3 headline combined preservation and simplicity. Its underlying
answer remains a simplicity miss, but it should not be read as proof that the edited
skill became generally worse or unsafe. No runtime skill text changed during this
investigation. No release or installation occurred.

## Evidence and reproduction

[Skill snapshots](skill-snapshots.zip), original hashes in [manifest.json](manifest.json),
raw final answers, submitted decision artifacts and manual verdicts are retained here.
Local absolute paths are replaced with explicit markers. Full private events, preflight
logs and the original adapter remain in the ignored local record. The public
[runner](run.py) relocates filesystem paths and accepts a fresh record directory as its
second argument; the manifest's adapter hash refers to the original private adapter.

The public runner uses the retained task in the preceding run and snapshots the current
source at freeze time. To reproduce these exact conditions after source changes, use
the archived skill trees rather than treating a new working-tree snapshot as identical.
`python3 run.py freeze /path/to/new-record` freezes a new diagnostic; run `measure` with
`READY=1` afterward. Manually review its outputs against the frozen criteria; the
artifact-presence check is not a design verdict. Run `python3 storage-proof.py` for the
independent one-column feasibility check.
