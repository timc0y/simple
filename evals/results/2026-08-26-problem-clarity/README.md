# Problem clarity and explanation eval

## Decision

Keep the problem-solving and writing changes.

Simple now works from a shared problem before committing to the requested
implementation. It also answers the reader's question first and uses a small visual
when a flow or relationship is otherwise hard to picture.

## Result

Both graders accepted these answers:

| Condition | Passed |
| --- | ---: |
| No skill | 6/8 |
| Ponytail | 7/8 |
| Simple | 8/8 |
| Simple and Ponytail | 7/8 |

All four conditions passed the problem-first case in every run. The difference came
from the explanation case: no skill passed 2/4, Ponytail 3/4, Simple 4/4, and both
skills 3/4. Simple most consistently defined `ready` before explaining the worker flow
and separate notification retry.

## Method

Codex Luna and Terra each answered two cases twice under four isolated conditions: no
skill, Ponytail, Simple, and both skills. This produced 32 answers. Luna and Terra then
graded every answer independently. Each grader first accepted both known-pass examples
and rejected both known-fail examples. A result counts only when both graders pass it.

The first problem-first rubric incorrectly required a narrower retry boundary. A stable
payment idempotency key already satisfies the stated duplicate-charge outcome. The
second draft incorrectly required every supplied fact to be repeated. Both requirements
were removed before the recorded grade because they rewarded compliance with a chosen
answer rather than problem solving and clear writing. The candidate answers were not
rerun after either correction.

This is a small behavioural sample. It supports the writing change and shows no
problem-framing regression, but it does not show that Simple alone caused the
problem-first answers; every condition passed that case.

## Starter-prompt activation check

On 2026-08-27, Luna and Terra each reran both cases with the Simple skill available but
without an instruction to open it. The prompts' ordinary “Use Simple” wording was the
only activation cue. All four runs opened `SKILL.md` and `references/writing.md`. Both
blind graders passed all four answers after accepting the known-pass references and
rejecting the known-fail references.

This checks activation and answer quality for the two Codex starter prompts. It does
not measure whether people notice or choose those prompts in the interface.
