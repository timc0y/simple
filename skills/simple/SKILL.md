---
name: simple
description: >-
  Find the smallest truthful design for non-trivial architecture, refactoring,
  compatibility, migration, or repository-specific decisions. Also use when asked
  to keep development comments, Markdown, or communication concise and useful.
---

# Simple

Find the smallest truthful solution that preserves real behaviour, safety, intent,
and proof.

Read the nearest `SIMPLE.md` before non-trivial work. Its repository facts override
generic assumptions. If a material fact is absent, establish it or state the
uncertainty; do not invent an obligation or permission.

## Decide from reality

Establish the actual users, operators, external consumers, public contracts,
persistent data, compatibility commitments, scale, and failure consequences.

Apply KISS to the solution shape and YAGNI to hypothetical obligations. Use
Chesterton's Fence before removal. Hide necessary complexity behind one clear owner.
Repository evidence decides what these principles mean here.

Reuse the ordinary path. Add a concept only for a present requirement. Remove the
route, state, explanation, and cleanup displaced by the change. Prove behaviour
through an independent surface.

## Keep knowledge load-bearing

Write only what helps the next reader decide, operate, recover, or verify. Let code
explain what happens. Use comments for reasons, contracts, invariants, traps, and
invalidation conditions. Update the source of truth directly.

Lead communication with the outcome. Report meaningful evidence, decisions,
blockers, risk, and the next relevant action. Do not narrate routine tool use.

## Load specialist guidance only when needed

- Architecture or new abstractions: read `references/architecture.md`.
- Compatibility, versioning, or migrations: read `references/compatibility.md`.
- Comments, Markdown, prompts, or technical prose: read `references/writing.md`.
- Refactoring or deletion: read `references/refactoring.md`; for deletion tooling,
  also read `references/deletion-tools.md`.
- Plans, progress, reviews, or handoffs: read `references/communication.md`.
- Repository initiation or profile changes: read `references/profile-template.md`,
  then run `scripts/simple.mjs setup` or `scripts/simple.mjs check`.

Keep the implementation, tests, comments, documentation, and handoff consistent.
