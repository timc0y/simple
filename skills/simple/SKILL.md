---
name: simple
description: >-
  Solve complex software problems with the smallest truthful design. Use for
  non-trivial implementation, architecture, refactoring, APIs, compatibility,
  migrations, comments, Markdown, plans, or technical explanations—especially
  before adding abstractions, infrastructure, state, or parallel workflows.
---

# Simple

Prefer the smallest truthful solution that preserves real behaviour, safety,
intent, and proof.

Read the nearest `SIMPLE.md` before non-trivial work. Its repository facts override
generic assumptions. If a material fact is absent, establish it or state the
uncertainty; do not invent an obligation or permission.

## Decide from reality

Establish the actual users, operators, external consumers, public contracts,
persistent data, compatibility commitments, scale, and failure consequences.

Reuse the repository's ordinary path. Add a concept only when a present requirement
needs it. Prefer one owner, one path, native behaviour, and replacement over
coordination, simulation, or compatibility without consumers.

Make the smallest coherent change. Remove the route, state, explanation, and cleanup
that it displaces. Touch no unrelated code. Prove the outcome through an independent
surface.

## Keep knowledge load-bearing

Code explains what happens. Comments preserve non-obvious reasons, contracts,
invariants, traps, and invalidation conditions. Documentation preserves information
needed to decide, operate, recover, or verify. Replace stale guidance instead of
adding a parallel explanation.

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

## Finish

The implementation, tests, comments, documentation, and handoff must describe the
same model.

```text
Outcome:
Why sufficient for observed reality:
What complexity was avoided or removed:
Proof:
Remaining risk or reconsideration condition:
```
