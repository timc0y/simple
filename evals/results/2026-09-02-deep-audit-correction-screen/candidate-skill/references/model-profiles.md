# Capability profiles

Use one canonical Simple skill. Adapt the amount of guidance to observed model and
harness behaviour, not to marketing names or assumptions about a model family.

## Delegation tiers

Subagents are optional. Use them only when the host exposes delegation and a bounded
independent task could improve the result. Use the capability information that the
current host or subagent tool exposes. This includes models, effort controls,
permissions, and context modes. Do not require an alias that the host does not expose.

Route work by capability:

- **Light:** narrow, clear, repeatable, high-volume evidence work. Current examples
  include Codex Luna and Claude Haiku.
- **Medium:** evidence interpretation, independent solutions, option comparison, and
  falsification. Current examples include Codex Terra and Claude Sonnet.
- **Heavy:** ambiguous synthesis, difficult-to-reverse decisions, and adjudication of
  material disagreement. Current examples include Codex Sol and Claude Opus or Fable.

For OpenCode, map these tiers to the provider models and variants configured in the
current host. These names are examples, not a compatibility contract. Host-provided
capability information overrides this list.

Choose the least costly model likely to complete the bounded role. Reasoning effort
is a separate control: use more only when the role's ambiguity or consequence needs
it. If model selection is unavailable, inherit the current model. If delegation is
unavailable, complete the workflow in the lead context and state when a review was not
independent.

Do not ask a light agent for architecture judgement. Escalate to medium when evidence
needs interpretation. Escalate to heavy only when checked evidence leaves a material
conflict, a public contract, retained data, security, recovery, or another difficult
to reverse consequence.

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

For operator emulation, provide the documented doctrine, its source, repository facts,
and the proof boundary. Ask for an independent baseline and doctrine pass without
scripting the conclusion.

Do not enumerate obvious tool calls, repeat the core method in several forms, or add
worked examples by default. Let the model choose the route while preserving the
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

For operator emulation, make the sequence explicit: baseline, sourced doctrine,
challenged requirement, blind spot, synthesis, and proof. State that personality
imitation and simulated user evidence are invalid.

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
9. produces plain Markdown without decorative structure unless requested;
10. selects a relevant operator doctrine without anchoring on reputation;
11. distinguishes documented principles, inference, simulation, and proof;
12. preserves the doctrine's blind spots and real safety boundaries.

Start with the autonomous profile. Add the smallest adapter for a witnessed,
repeatable failure. Remove the adapter when later evaluations pass without it.

## Evaluation record

Record the skill commit, model revision, host or harness, reasoning setting, task,
result, token use, latency, cost, interventions, operator-attribution errors, mode
confusion, safety-boundary violations, and grader evidence. Compare no skill, canonical
skill, and canonical skill plus adapter on identical tasks. Keep an adapter only when
it improves quality or cost without weakening the proof contract.
