# Simple evaluation protocol

Evaluate Simple as a decision skill, not as a collection of preferred phrases.

Run every representative task under the same model, harness, tools, repository state,
and reasoning setting with and without the skill, and with any capability adapter under
test as a third condition. Do not compare a new model with an adapter against an older
model without one and call the difference a skill gain.

Record pass or fail against the task grader; invented obligations, compatibility,
state, owners, or workflows; lost material facts; plain-writing violations;
operator-attribution errors; safety-boundary violations; unsupported progress claims;
human interventions; and the model revision, harness, reasoning setting, and skill
commit.

Store reviewed results under `evals/results/` with raw model output or a durable
reference to it. Record failures as evidence; do not rewrite graders after seeing one
model's answer unless the task contract was genuinely wrong. Keep an adapter only when
repeated paired runs improve quality or cost without weakening present-obligation,
proof, or plain-writing boundaries; remove it when later model versions pass without
it.
