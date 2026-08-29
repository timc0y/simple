# Simple

## Reality

- Stage and users: Tim maintains and uses the method. The repository publishes installation routes for the plugin and skill.
- Operators: Tim maintains releases and repository profiles.
- External consumers: the repository does not establish whether anyone outside Tim uses an installed surface.
- Public contracts: the skill, command entry points, references, plugin manifests, hooks, and `simple.mjs` commands.
- Persistent production data: none.
- Compatibility commitments: preserve published paths and commands; replace unpublished internals freely.
- Scale and failure consequences: local instructions can misguide agents, so profiles must not invent obligations or deletion permission.

## Preserve

- Progressive disclosure: the core stays small while specialist knowledge remains available.
- One shared skill and repository context across supported agent hosts.
- Repository facts and reconsideration conditions that prevent speculative architecture.

## Current boundary

- The plugin packages Simple for Codex and Claude Code. The local installer exposes
  one source through the shared agent directory and four host routes.
- The Codex package points to the shared lifecycle and writing-reminder hooks; the Claude package uses the same hook bundle. Codex needs one `/hooks` trust approval on each machine.
- Pre-write hook context reaches the model after the triggering tool result. It can guide the next step, but it cannot shape edit arguments that the model already chose.
- Codex also receives repository context through `AGENTS.md` and the skill, so the route survives hosts without hook support.
- Setup records no inferred users or production promises.

## Ordinary paths

- Shared guidance lives in `skills/simple`; host manifests only package it.
- `README.md` owns public setup and use; the skill references own detailed method guidance.
- `scripts/link-skill.mjs` owns the shared agent route and four local host routes. It
  replaces stale symlinks but refuses to replace a real file or directory.
- `simple.mjs init` creates the route and profile; `setup` remains an alias for existing users; `check` validates their shape.
- `audit`, `board`, `plan`, `review`, `write`, and `emulate` are thin judgement modes over the shared skill; operator lenses stay sourced specialist references.
- Audit crawlers collect bounded evidence; the lead agent owns synthesis and recommendations.
- Board reviewers provide optional read-only views; the lead resolves them through evidence, not vote.
- `evals/README.md` owns the eval protocol; `evals/results/README.md` owns the current decision index; each run owns its raw evidence.
- `evals/normalize-results.mjs` converts active TSV runner output into the shared result record.
- One hook script handles session, subagent, and relevant pre-write events for both hook-capable hosts.

## Proof

- Repository checks: `npm test`
- Profile structure: `node skills/simple/scripts/simple.mjs check`
- Patch formatting: `git diff --check`
- Model behaviour: reviewed Luna and Terra runs indexed in `evals/results/README.md`

## Reconsider when

- Add parsing only if observed edits cannot be routed reliably with narrow heuristics.
- Add compatibility only when a published installer or host needs the old surface.
- Split a command into another skill only when measured retrieval failures make the split necessary.
- Add an audit crawler lane only when it finds decision-changing evidence in representative repositories.
- Remove the `AGENTS.md` route only if hook injection is observed reliable across every supported host.
- Add profile layering only when nested profiles need shared root facts and an isolated evaluation proves the merge rule.
