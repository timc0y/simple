# Readable rules: 12 September 2026

Gate passed on the verdict, three of four new rules tied, one was removed. Strict
passes: candidate 6 of 14, current Simple at `c28f3b7` 2 of 14, no skill 3 of 14. All
seven grader self-tests passed. No current-pass/candidate-fail pair. First run to score
the four rubric dimensions beside the verdict; see [scores.tsv](scores.tsv) and
[noise-floor.tsv](noise-floor.tsv).

| Case | None r1 / r2 | Current r1 / r2 | Candidate r1 / r2 | Reading |
| --- | --- | --- | --- | --- |
| Debug spiral | Fail / Fail | Fail / Fail | Fail / Fail | Nobody stops to ask; criteria conflict with the rubric on closing questions |
| List cap | Fail / Fail | Fail / Fail | Fail / Fail | Flat twelve-item list in every condition; the rule had no effect |
| Failure shape | Fail / Fail | Fail / Fail | Fail / Fail | Ceiling on the shape; all failed the one-recommendation clause |
| Inspection is not execution | Pass / Pass | Fail / Fail | Pass / Fail | Skilled answers dropped one status line; candidate better than current, below no skill |
| Round status | Fail / Fail | Fail / Fail | Pass / Fail | As on 11 September |
| Stated requirement (regression) | Fail / Fail | Pass / Fail | Pass / Pass | Gate wording graded inconsistently across runs |
| Stated requirement, consumer (regression) | Pass / Fail | Pass / Fail | Pass / Pass | Held |

## Decision

The core debug-spiral trigger showed no effect and cost readability through a conflict
between the case criteria and the rubric, so it leaves the shipped skill and stays in
the owner's operator file. The list-cap, failure-shape, and inspection lines in the
writing reference ship as recorded ties: no regression against current, no measured
gain. The shipped candidate equals the frozen candidate minus the one core line.
[manual-review.json](manual-review.json) records each reading.

## What the scores add

Readability sat at 5 for most conditions on the short cases and at 1 for every
condition on the list case, which is the rubric doing its job: a flat list of twelve
fails the list check whoever writes it. The one candidate-below-current readability
gap is on debug-spiral and is the criteria conflict. Blockers appeared in every
condition on two cases, so they carried no information there; where they differed,
the candidate had fewer than current.

## Method

Forty-two sequential `gpt-5.6-luna` solver calls, default reasoning, seven cases, three
conditions, two repeats, order reversed in the second repeat, one excluded preflight.
Isolated Codex harness as before; skill reading forced. One Luna grader call per case
with the criteria, the rubric between its judge markers, and the references. The
candidate read `references/writing.md` in every cell of the four new cases
([costs](costs.tsv)). Total solver input about 1.41 million tokens, mostly cached.
The four new cases are synthetic; the frozen inputs are in [inputs](inputs/).

## Limits

Two repeats on lead-authored cases with the skill read forced. The debug-spiral and
list-cap cases sit at a floor and the failure-shape case at a ceiling, so they
cannot show a gain; they need a long-transcript prefix or a tool loop to reproduce
the corpus failures they were written from.
