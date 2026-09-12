# Simple

## Reality

- Stage and users: Tim maintains and uses the method. The repository publishes installation routes for the plugin and skill.
- Operators: Tim maintains releases and repository profiles.
- Owner-stated use: PR volume is low. Simple fits direct implementation, verification
  and authorized delivery; PR watching and queue automation are not requirements.
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

- Plugins package Simple for Codex and Claude Code; an OpenCode plugin and a Gemini
  extension inject the same context without hooks. The local installer exposes one
  source through the shared agent directory and four host routes.
- The Codex package points to the shared lifecycle and writing-reminder hooks; the Claude package uses the same hook bundle. Codex needs one `/hooks` trust approval on each machine.
- Pre-write hook context reaches the model after the triggering tool result. It can guide the next step, but it cannot shape edit arguments that the model already chose.
- A file edit records one session-local temporary marker. The next stop forces one
  reconciliation pass, clears the marker, and allows the continued turn to stop.
  Read-only turns do not trigger reconciliation.
- Codex also receives repository context through `AGENTS.md` and the skill, so the route survives hosts without hook support.
- A directory-registered Claude Code marketplace runs hooks from the checkout, not the plugin cache (seen 11 Sep 2026).
- Setup records no inferred users or production promises.

## Ordinary paths

- Shared guidance lives in `skills/simple`; host manifests only package it.
- Conditional references cover diagnosis, verification, experiments, delivery,
  session learning and type design without adding registered skills or hook modes.
- `upstream/` keeps pinned PStack and Ponytail source archives for review. Adopted
  lessons live in existing Simple references; upstream skills and hooks are inactive.
- `README.md` owns public setup and use; the skill references own detailed method guidance.
- `scripts/link-skill.mjs` owns the shared agent route and four local host routes. It
  replaces stale symlinks but refuses to replace a real file or directory.
- `simple.mjs init` creates the route and profile; `setup` remains an alias for existing users; `check` validates their shape.
- `audit`, `board`, `research`, `work`, `reconcile`, `plan`, `review`, `write`, `round`, and `emulate` are thin judgement modes over the shared skill; operator lenses stay sourced specialist references. `round` owns `simple/round.md`; the `simple/` folder beside the profile holds every temporary Simple artifact.
- `references/repository-work.md` owns the repository contract, swarm boundaries,
  end-to-end work, reconciliation, and release handoff guidance. Repository
  `AGENTS.md` files own only their local read order, owners, checks, and authority.
- Audit crawlers collect bounded evidence; the lead agent owns synthesis and recommendations.
- Deep audits use the multi-lens reference; ordinary audits stay scoped.
- Board reviewers give optional read-only views; the lead resolves them by evidence.
- `evals/README.md` owns the eval protocol; `evals/results/README.md` owns the current decision index; each run owns its raw evidence.
- `evals/normalize-results.mjs` converts active TSV runner output into the shared result record.
- `evals/preservation/run.py` reuses the behavior runner for preservation checks;
  `research/simple-skill-ideas.md` retains hypotheses.
- One hook script handles session, subagent, relevant write, shell and MCP tool, and stop events for both hook-capable hosts. It injects the profile, `simple/round.md`, and the operator file at `~/.config/simple/operator.md`, and denies guarded tool calls unless the current message asks for them or affirms the agent's own proposal; a negation never authorises.

## Proof

- Repository checks: `npm test`; CI runs them on Linux and Windows and installs the plugin.
- Profile structure: `node skills/simple/scripts/simple.mjs check`
- Patch formatting: `git diff --check`
- Verifier self-tests: `npm run test:behavior` and `npm run test:preservation`
- Workflow verifier self-test: `npm run test:workflow`
- Model behaviour: reviewed runs indexed in `evals/results/README.md`; current
  preservation runs use Luna only.

## Reconsider when

- Add parsing only if observed edits cannot be routed reliably with narrow heuristics.
- Add compatibility only when a published installer or host needs the old surface.
- Split a command into another skill only when measured retrieval failures make the split necessary.
- Add an audit crawler lane only when it finds decision-changing evidence in representative repositories.
- Remove the `AGENTS.md` route only if hook injection is observed reliable across every supported host.
- Add profile layering only when nested profiles need shared root facts and an isolated evaluation proves the merge rule.
- Narrow or remove stop reconciliation if measured runs add completion cost without
  reducing stale repository context.
- Narrow or remove a repository workflow when representative rollouts show that it
  duplicates the core method without reducing repeated user correction.
