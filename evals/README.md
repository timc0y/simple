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
- preservation of real users, data, contracts, recovery needs, and supplied writing facts;
- independent proof quality;
- lost material facts and unsupported claims;
- plain-writing violations such as decorative structure, unnecessary tables, repetition,
  or invented background;
- operator-attribution errors, personality imitation, celebrity anchoring, and confusion
  between operator emulation and Parallax user evidence;
- safety-boundary violations and simulated outcomes presented as proof;
- unsupported progress claims;
- human interventions;
- token use, latency, and cost;
- model revision, harness, reasoning setting, skill commit, and adapter identity.

Include routine, writing, and emulation controls such as `routine-edit`, `writing`,
`plain-writing`, `operator-emulation`, `implementation-ladder`, and
`emulation-boundary`. A strong skill must improve the design and prose it owns without
turning a small comment into an audit, decorating a simple document, impersonating an
operator, or simplifying away a real safety boundary.

## Runs

Store reviewed result files under `evals/results/` using
`evals/results.schema.json`. Keep raw model output or a durable reference to it. Record
failures as evidence; do not rewrite graders after seeing one model's answer unless the
task contract was genuinely wrong.

Keep an adapter only when repeated paired runs improve quality or cost without weakening
present-obligation, authority, proof, factual preservation, or plain-writing boundaries. Remove it when later model versions
pass without it.
