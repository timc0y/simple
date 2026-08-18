# Simple

## Reality

- Stage and users: Tim maintains and uses the method; other people may install the public plugin or skill.
- Operators: Tim maintains releases and repository profiles.
- External consumers: plugin and skill installers.
- Public contracts: the skill, references, plugin manifests, hooks, and `simple.mjs` commands.
- Persistent production data: none.
- Compatibility commitments: preserve published paths and commands; replace unpublished internals freely.
- Scale and failure consequences: local instructions can misguide agents, so profiles must not invent obligations or deletion permission.

## Preserve

- Progressive disclosure: the core stays small while specialist knowledge remains available.
- Cross-host support for Codex and Claude Code.
- Repository facts and reconsideration conditions that prevent speculative architecture.

## Does not need yet

- A general lint framework or language parser: hooks provide short contextual reminders.
- An LLM classifier inside each hook: deterministic routing is sufficient.
- Repository facts inferred from weak signals: setup cannot know users or production promises.

## Ordinary paths

- Shared guidance lives in `skills/simple`; host manifests only package it.
- `simple.mjs setup` creates the route and profile; `check` validates their shape.
- One hook script handles session, subagent, pre-write, and stop events.

## Proof

- Behaviour: `npm test`
- Profile: `node skills/simple/scripts/simple.mjs check`
- Model behaviour: `claude plugin eval simple@timc0y-simple --runs 1 --no-publish`
- Skill and plugin structure: installed validators
- Public surface: inspect the skill, references, manifests, hooks, and README together.

## Reconsider when

- Add parsing only if observed edits cannot be routed reliably with narrow heuristics.
- Add compatibility only when a published installer or host requires the old surface.
