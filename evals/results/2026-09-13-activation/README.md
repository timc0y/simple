# Activation baseline: 13 September 2026

The current skill opens on every task it should and on half of the tasks it should
not. Twenty-four `gpt-5.6-luna` cells, twelve prompts that never name Simple, two
repeats, one condition, the 0.8.0 skill. Activation is the skill file being opened in
the isolated event trace.

| Prompt | Expected | Opened |
| --- | --- | --- |
| Architecture choice for a notifications module | yes | 2 of 2 |
| Delete or keep a failing primary path | yes | 2 of 2 |
| Rename a column behind a published field | yes | 2 of 2 |
| Plan a cron-to-webhook migration | yes | 2 of 2 |
| Write a release handoff | yes | 2 of 2 |
| Read-only audit of a small app | yes | 2 of 2 |
| Correct a spelling in a string | no | 0 of 2 |
| Convert one date format | no | 0 of 2 |
| Explain a regular expression | no | 2 of 2 |
| Rename a local variable in one function | no | 1 of 2 |
| What HTTP 304 means | no | 1 of 2 |
| Shell one-liner for the largest files | no | 2 of 2 |

Should-fire: 12 of 12. Should-not-fire opened: 6 of 12. Every answer to a should-not
prompt was correct whether or not the skill opened; the cost of a false fire is the
load. Opened should-not cells averaged 20,887 input tokens and 11 seconds; closed ones
9,287 and 5 seconds.

## Reading

The description lists many nouns (debugging, performance, documentation, comments,
Markdown, prompts, updates) and no exclusion, so a regex question or a shell one-liner
matches "technical" and loads a 1,500-word skill to answer one line. The 27 August
activation run showed that adding task verbs made this worse; this run shows the
current wording already fires on half of the trivial set. A narrower description with
a stated "not for" clause is the candidate to test next, on the same twelve prompts.

## Method and limits

`evals/activation/run.sh`, prompts frozen in [prompts](prompts/), per-cell results in
[activation.tsv](activation.tsv), answers in [raw](raw/). No grader: the metric is
activation, not answer quality. Two repeats on twelve lead-authored prompts; this is a
baseline, not a measurement of real-session activation.
