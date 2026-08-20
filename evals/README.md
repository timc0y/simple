# Simple evaluation protocol

Evaluate Simple as a decision skill, not as a collection of preferred phrases.

## Conditions

Run every representative task under the same model, harness, tools, repository state,
and reasoning setting in three conditions:

1. `no-skill`
2. `canonical`
3. `canonical-plus-adapter`

The adapter is the smallest capability-specific addition under test. Do not compare a
new model with an adapter against an older model without one and call the difference a
skill gain.

## Measures

Record:

- pass or fail against the task grader;
- invented obligations, compatibility, state, owners, or workflows;
- preservation of real users, data, contracts, and recovery needs;
- independent proof quality;
- unsupported progress claims;
- human interventions;
- token use, latency, and cost;
- model revision, harness, reasoning setting, skill commit, and adapter identity.

Include routine and writing controls such as `routine-edit`, `writing`, and
`plain-writing`. A strong skill must improve the design and prose it owns without
turning a small comment into an audit or decorating a simple document.

## Runs

Store reviewed result files under `evals/results/` using
`evals/results.schema.json`. Keep raw model output or a durable reference to it. Record
failures as evidence; do not rewrite graders after seeing one model's answer unless the
task contract was genuinely wrong.

Keep an adapter only when repeated paired runs improve quality or cost without weakening
present-obligation, authority, or proof boundaries. Remove it when later model versions
pass without it.
