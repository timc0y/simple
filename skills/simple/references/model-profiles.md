# Capability profiles

Use one canonical Simple skill. Adapt the amount of guidance to observed model and
harness behaviour, not to marketing names or assumptions about a model family.

## Autonomous

Use for strong frontier models and tasks with safe, inspectable actions.

Provide:

- the requested outcome;
- the nearest `SIMPLE.md` facts that change the decision or writing;
- hard constraints and the authority boundary;
- the existing owner and ordinary path when known;
- independent proof and explicit stop conditions.

For writing, also provide the reader, destination, source facts, and plain-output
standard. Do not prescribe a document outline when the model can choose the smallest
useful structure itself.

Do not enumerate obvious tool calls, repeat the seven-step method in several forms, or
add worked examples by default. Let the model choose the route while preserving the
contract.

## Guided

Use when the model misses scope, ownership, or proof without more structure, or when
the task has consequential state transitions.

Make the decision stages explicit: establish reality, identify the owner, name the
obstruction, choose the smallest design, remove displaced machinery, and verify the
result. Add one checkpoint before irreversible or externally visible actions.

For writing, name the required content and give a minimal allowed structure. State
plain-Markdown constraints directly when the model otherwise adds tables, decorative
headings, repetition, or unsupported background.

Use an example only when a representative evaluation shows that a short example fixes
a repeatable failure without narrowing valid solutions.

## Scripted

Use for compact models, repetitive operations, or fragile procedures where variation
has little value.

Move exact mechanics into inspected deterministic scripts. Give the model narrow
inputs, typed outputs, fixed validation, retry limits, and success and failure stops.
Keep architectural judgement and approval outside the script. For repeated writing
formats, use a small validated template or linter only when free-form guidance has a
measured failure; do not turn ordinary Markdown into a publishing framework.

## Capability probe

Before adding guidance for a new model or harness, test whether it:

1. scopes the requested outcome without inventing future obligations;
2. finds the existing owner and ordinary path;
3. distinguishes missing evidence from permission to add or delete;
4. chooses independent proof rather than self-grading implementation details;
5. grounds progress claims in actual tool results;
6. stops at authority, evidence, or recovery boundaries;
7. selects design or writing mode without blending them unnecessarily;
8. preserves material facts while removing repetition and filler;
9. produces plain Markdown without decorative structure unless requested.

Start with the autonomous profile. Add the smallest adapter for a witnessed,
repeatable failure. Remove the adapter when later evaluations pass without it.

## Evaluation record

Record the skill commit, model revision, host or harness, reasoning setting, task,
result, token use, latency, cost, interventions, and grader evidence. Compare no skill,
canonical skill, and canonical skill plus adapter on identical tasks. Keep an adapter
only when it improves quality or cost without weakening the proof contract.
