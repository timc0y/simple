# Simple evaluation protocol

Evaluate Simple as a decision skill. Do not grade preferred phrases.

## Compare equal conditions

Use the same model, harness, tools, repository state, and reasoning setting for each
condition. Compare no skill, the current skill, and one candidate on the same task.
Add a Ponytail condition only when skill interaction is part of the question.

Test activation separately from execution. An activation run must not force the model
to read the skill. An execution run must make each model read its assigned skill.

## Prove the grader first

Each case must contain these files:

- `prompt.md`;
- `graders/criteria.md`;
- `graders/references/pass.md`;
- `graders/references/fail.md`;
- `SIMPLE.md` when repository facts affect the answer.

The grader must accept the pass reference and reject the fail reference. Reject the
run if this check fails. Keep grader files hidden from the solver.

Grade present obligations, ownership, lost facts, independent proof, unsupported
claims, mode errors, safety boundaries, and writing quality. Do not grade one
preferred implementation when more than one design satisfies the task.

## Keep a complete run record

Store each reviewed run in `evals/results/<date>-<name>/`. Keep the exact runner, raw
answers, grader records, condition map, and a short `README.md` with the decision.

Active TSV runners must also call `evals/normalize-results.mjs`. This command writes a
`results.json` file that matches `evals/results.schema.json`. The normalized record
keeps each model and condition separate and points each task to its raw answer.

The [result index](results/README.md) marks each run as valid, superseded, invalid, or
inconclusive. Old runs can keep their first record format. Do not present an old record
as normalized if it does not match the current schema.

## Change the skill only when the result moves

Change one instruction at a time where possible. Run the current and candidate text
on the affected cases. Keep the edit only when it improves the result without a new
failure or unjustified context cost. A tie loses.

Record negative results. Do not change a grader after a model answer unless the task
contract was wrong. If you change the contract, state why and run the affected answer
again when the change can alter its grade.

Record the model revision, harness, reasoning setting, skill commit, token use,
latency, interventions, and limits when those facts are available. Never compare two
different model revisions and call the difference a skill gain.
