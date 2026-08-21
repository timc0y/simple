# Simple

## Reality

- Stage and users: Tim maintains and uses the method; other people may install the public plugin or skill.
- Operators: Tim maintains releases and repository profiles.
- External consumers: plugin and skill installers.
- Public contracts: the skill, command entry points, references, plugin manifests, hooks, and `simple.mjs` commands.
- Persistent production data: none.
- Compatibility commitments: preserve published paths and commands; replace unpublished internals freely.
- Scale and failure consequences: local instructions can misguide agents, so profiles must not invent obligations or deletion permission.

## Preserve

- Progressive disclosure: the core stays small while specialist knowledge remains available.
- One shared skill and repository context across supported agent hosts.
- Repository facts and reconsideration conditions that prevent speculative architecture.

## Current boundary

- The plugin packages Simple for Codex and Claude Code; the local installer exposes the same source to Codex, Claude Code, OpenCode, and Gemini.
- Claude Code receives deterministic lifecycle and writing reminders through hooks.
- Codex receives repository context through `AGENTS.md` and the skill; its current plugin manifest does not register hooks.
- Setup records no inferred users or production promises.

## Ordinary paths

- Shared guidance lives in `skills/simple`; host manifests only package it.
- `scripts/link-skill.mjs` owns the four local host routes; it does not copy the skill.
- `simple.mjs init` creates the route and profile; `setup` remains an alias for existing users; `check` validates their shape.
- `audit`, `plan`, `review`, and `write` are thin judgement modes over the shared skill; operator emulation stays a specialist reference, not a command.
- Audit crawlers collect bounded evidence; the lead agent owns synthesis and recommendations.
- One Claude Code hook script handles session, subagent, and relevant pre-write events.

## Proof

- Behaviour: `npm test`
- Profile: `node skills/simple/scripts/simple.mjs check`
- Model behaviour: `claude plugin eval simple@timc0y-simple --runs 1 --no-publish`
- Skill and plugin structure: bundled validators
- Public surface: inspect the skill, references, manifests, hooks, and README together.

## Reconsider when

- Add parsing only if observed edits cannot be routed reliably with narrow heuristics.
- Add compatibility only when a published installer or host requires the old surface.
- Split a command into another skill only when measured retrieval failures require it.
- Add an audit crawler lane only when it finds decision-changing evidence in representative repositories.
- Add Codex hooks when its accepted plugin manifest and runtime expose them reliably.
