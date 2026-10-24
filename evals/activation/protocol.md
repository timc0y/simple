# Activation screen protocol

## Current instrumentation, 24 October 2026

New runs use evidence version 2. The historical registrations and results below
are preserved; they have not been regraded as though they used the new parser.
Only a completed, successful literal read of the isolated workspace's SKILL.md
with returned text establishes observed opening. The classifier accepts narrow
cat/sed/head forms and literal shell wrappers, never executes trace commands, and
requires a successful solver exit, completed turn and nonempty final response.
Path mentions, echoes and listings do not count. Ambiguous commands, incomplete
reads, changed-directory compounds and unknown tool-event contracts remain invalid,
with a null activation value, rather than valid negative observations. This is a
conservative observed-read screen, not proof of natural activation for every future
host tool or of correct application of the skill.

Report invalid cells separately from both hit and false-fire denominators. Missing
usage is unknown. Retain the parser, exact skill/prompt snapshots, source checksums,
solver exit and per-cell classification; raw event traces stay in local scratch
until separately reviewed for public disclosure. Resume checks frozen input hashes
and rejects old record formats. Never overwrite an earlier published result to
make a rerun look like its original execution. Per-cell rows are written atomically;
the summary is rebuilt from all planned cells, not from an append-only partial TSV.
An interrupted post-processing step can reuse the recorded solver exit and trace.
An attempt with no recorded exit is unresolved and must not be automatically replayed.
Run one process per record; resume keeps the frozen model, repeats and conditions.

## Historical registration

Registered before any solver call, 13 September 2026.

Question: with the current skill available but never named, does the agent open it on
tasks the description targets, and leave it closed on tasks it does not?

Cells: twelve prompts, six should-fire (architecture choice, fallback deletion,
compatibility rename, migration plan, release handoff, read-only audit) and six
should-not-fire (a typo, a regex explanation, a local rename, a date format, an HTTP
status question, a shell one-liner), two repeats, one condition, `gpt-5.6-luna`,
default reasoning, isolated Codex harness. Twenty-four sequential calls. Activation is
the skill file being opened in the event trace; no grader.

Metric: should-fire hit rate and should-not-fire false-fire rate, reported separately.
No threshold is registered; this is the first negative-trigger baseline for Simple
and exists to be compared against a later description change. Prompts are frozen in
the record. The 27 August activation run is the only prior evidence, with one
trivial control.

## Description A/B, registered 13 September 2026 after the baseline

Question: does a narrower description with a stated "not for" clause keep every
should-fire opening and cut the false fires? Conditions: current (the 0.8.0
description) and candidate (`candidate-description.txt`, which drops the noun list
and adds "Not for a one-line answer, a lookup, or a single-file edit with no design
decision"). Same twelve prompts, two repeats, condition order reversed in the second
repeat, forty-eight cells. Gate: candidate should-fire stays 12 of 12 and should-not
false fires fall below the baseline's 6 of 12; any should-fire miss is a regression
that blocks adoption regardless of the false-fire gain. The 27 August run is the
only prior A/B and it moved in the opposite direction.
