# Writing rules and round: 11 September 2026

Public record note: the four new cases were authored from a private client engagement.
Their frozen inputs, the solver answers to them, all event logs, and the grader prompts
were removed from this record and are kept only in the maintainer's local context. The
public case files under `evals/` were re-themed after the run with the same structure
and criteria; the grades below were produced against the originals.

Inconclusive, with two defective case contracts and one unstable grader criterion.
Strict passes: candidate 3 of 12, current Simple at `ee0e9f2` 4 of 12, no skill 2 of
12. All six grader self-tests passed. One current-pass/candidate-fail pair, reviewed
below. No behavioural gain is claimed.

| Case | None r1 / r2 | Current r1 / r2 | Candidate r1 / r2 | Reading |
| --- | --- | --- | --- | --- |
| Plain translation to a client | Fail / Fail | Fail / Fail | Fail / Fail | Ceiling; contract defect |
| Verdict first on a safety question | Fail / Fail | Fail / Fail | Fail / Fail | Ceiling; contract defect |
| Round status during multi-session work | Fail / Fail | Fail / Fail | Fail / Fail | Shape appeared only with candidate; criteria contradicted the instruction |
| Scope completion, written scenario | Pass / Pass | Pass / Pass | Pass / Pass | Ceiling |
| Stated requirement, incidental (regression) | Fail / Fail | Fail / Fail | Fail / Fail | Grader stricter than yesterday on the gate wording |
| Stated requirement, consumer (regression) | Fail / Fail | Pass / Pass | Pass / Fail | One pair; exit condition omitted once |

## What the answers show

Translation and verdict. All eighteen answers across both cases already did what the
rules ask: outcome in the first sentence, a before-and-after pair, the actor and the
place, a verdict in the first sentence, under a hundred words. The grader failed them
on literal criteria the lead wrote too tightly, recorded in
[manual-review.json](manual-review.json). These cases cannot distinguish conditions.
The corpus failures they were meant to test happened in long sessions where the reader
had not asked for plain language; a short prompt that says "keep it plain" or asks
"is this safe" elicits the behaviour from every condition.

Round status. Only the candidate produced the status shape: a state line first, four
separated groups, three dated decisions, the not-acted-on findings on one line, and
the stop condition last. The first candidate repeat was failed because the criteria
demanded the reply end with what remains while the candidate instruction says to end
with the stop condition. That is a contract defect in the case, not a model miss. The
second candidate repeat dropped two loose ends and fails on its merits. Current and no
skill produced a plain list with no state line and no decisions.

Scope completion. Every condition reported all three items done. The written scenario
cannot reproduce the observed failure, which occurs mid-loop with tools.

## The regression pair and yesterday's result

Today's grader required the relaxation gate to name the requester's confirmation.
Yesterday's grader passed candidate answers whose gate read "confirm that the consumer's
header-based import is the intended contract". Today's candidate answers use the same
wording and were failed. The criterion is graded inconsistently across runs, so the
[11 September stated-requirement screen](../2026-09-11-stated-requirement/README.md)
now carries a caveat: the design difference it reported persists in today's answers
(candidate reaches the existing writer with named costs and a gate; current still
hedges by preserving legacy columns in one repeat), but the strict 2 of 2 against 0 of
2 does not replicate under the stricter reading. Original grades on both runs are
retained.

The consumer control kept the requirement in every cell. The one candidate miss omitted
the exit condition, which current also missed once yesterday. That criterion is noisy.

## Method

Thirty-six sequential `gpt-5.6-luna` solver calls, default reasoning, six cases, three
conditions, two repeats, order reversed in the second repeat, one excluded preflight.
Isolated Codex harness as before; skill reading forced. The candidate skill was the
working tree, which includes the writing-rules edits, the `simple round` section, and
the report-once sentence. [Costs](costs.tsv) list reads per cell. The `references/
writing.md` and `references/commands.md` files were read by the candidate in every
round-status cell. Baseline commit and candidate state are in `inputs/commits.tsv`;
the candidate tree was uncommitted at run time and the frozen copy in `inputs/` is
authoritative.

## Decision

Adoption is the owner's call and is recorded separately. The lead's view: the
`simple round` command, template, hook injection and check are proved structurally
and are the one place the answers changed. The three writing-standard bullets, the
verdict-first sentence and the report-once line have no measured effect here and
cannot have one on these prompts. They need a probe with a long transcript prefix and
a reader who has not asked for plain language. Until then they are adopted, if at all,
on corpus evidence, not on this run.
