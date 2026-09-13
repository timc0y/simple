# Activation description A/B: 13 September 2026

The narrower description keeps every should-fire opening and removes every false
fire. Forty-eight `gpt-5.6-luna` cells: twelve prompts that never name Simple, two
repeats, two conditions, condition order reversed in the second repeat. Activation is
the skill file being opened in the isolated event trace.

| Prompt | Expected | Current opened | Candidate opened |
| --- | --- | --- | --- |
| Architecture choice for a notifications module | yes | 2 of 2 | 2 of 2 |
| Delete or keep a failing primary path | yes | 2 of 2 | 2 of 2 |
| Rename a column behind a published field | yes | 2 of 2 | 2 of 2 |
| Plan a cron-to-webhook migration | yes | 2 of 2 | 2 of 2 |
| Write a release handoff | yes | 2 of 2 | 2 of 2 |
| Read-only audit of a small app | yes | 2 of 2 | 2 of 2 |
| Correct a spelling in a string | no | 0 of 2 | 0 of 2 |
| Convert one date format | no | 0 of 2 | 0 of 2 |
| Explain a regular expression | no | 1 of 2 | 0 of 2 |
| Rename a local variable in one function | no | 1 of 2 | 0 of 2 |
| What HTTP 304 means | no | 1 of 2 | 0 of 2 |
| Shell one-liner for the largest files | no | 0 of 2 | 0 of 2 |

Current: should-fire 12 of 12, false fires 3 of 12. Candidate: should-fire 12 of 12,
false fires 0 of 12. Gate from the protocol: candidate should-fire stays 12 of 12 and
false fires fall below the baseline's 6 of 12. Both hold; the candidate description
ships.

Cost, mean per cell:

| Cells | Input tokens | Latency |
| --- | --- | --- |
| Should-not, current, opened (3) | 20,889 | 13.3 s |
| Should-not, current, closed (9) | 9,288 | 5.8 s |
| Should-not, candidate, closed (12) | 9,271 | 6.3 s |
| Should-fire, current (12) | 46,311 | 27.8 s |
| Should-fire, candidate (12) | 41,079 | 28.5 s |

## Reading

The current description fired on 6 of 12 trivial prompts in the morning baseline and
on 3 of 12 here with the same prompts, so the current condition's false-fire rate
moves by three cells between runs. The candidate's 0 of 12 sits below both, and each
of the three false fires in this run lands on a prompt the baseline also flagged
(regex, local rename, HTTP status). The candidate drops the noun list and adds "Not
for a one-line answer, a lookup, or a single-file edit with no design decision"; the
should-fire set, which includes an audit and a handoff that the noun list no longer
names, still opened every time. The description is the whole change; the skill body
was identical across conditions.

## Method and limits

`evals/activation/run.sh` with `CONDITIONS="current candidate"`, prompts frozen in
[prompts](prompts/), the tested wording in
[candidate-description.txt](candidate-description.txt), per-cell results in
[activation.tsv](activation.tsv), answers in [raw](raw/). No grader: the metric is
activation, not answer quality. The first repeat ran on 13 September in the morning;
a runner defect in the reversed-order loop stopped the second repeat before its first
cell, the loop was fixed and the run resumed from the recorded cells, so the second
repeat ran later the same day. Twelve lead-authored prompts and two repeats bound
this to a screen; the current condition's own drift between runs is the noise floor
to read the 3-to-0 change against. Real-session activation remains unmeasured.
