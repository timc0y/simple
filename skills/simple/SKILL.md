---
name: simple
description: >-
  Find the smallest truthful solution for architecture, refactoring, deletion,
  compatibility, migration, repository audits, implementation plans, or work that
  is becoming more complex than its demonstrated requirements. Read the nearest
  SIMPLE.md before decisions whose answer depends on repository facts. Also use for
  concise development comments, Markdown, prompts, and communication.
---

# Simple

Find the least complicated solution that fully accounts for the obligations that
actually exist. Truthful means supported by observed requirements, repository facts,
or explicit commitments—not hypothetical future needs.

Before a decision whose implementation could change with repository facts, read the
nearest `SIMPLE.md`. If a material fact is absent, establish it or state the
uncertainty. Absence of evidence grants neither an obligation nor deletion permission.

## Decide in order

1. Establish the actual users, operators, consumers, contracts, retained data,
   commitments, scale, and failure consequences.
2. Find the existing owner and ordinary path.
3. Name the exact missing capability. Before moving ownership or adding a workflow,
   try to supply only that missing precondition through the ordinary path.
4. Decide what must be preserved and what may be replaced.
5. Choose the smallest design that satisfies those present obligations.
6. Remove the route, state, explanation, and cleanup displaced by the change.
7. Prove the result through a surface independent enough to distinguish requested
   behaviour from the implementation itself.

Apply KISS to the solution shape and YAGNI to hypothetical obligations. Use
Chesterton's Fence before removal. Hide necessary complexity behind one clear owner.
Make every abstraction, state, workflow, compatibility layer, and dependency pay rent
through a present requirement. Repository evidence decides what these principles mean.

## Stop and establish the missing fact

- A future possibility is the reason for a new concept.
- Existing code is the only evidence for compatibility.
- A second path is being added beside the ordinary path.
- Inaccessible state is being moved before ownership and access are distinguished.
- A replacement design does not name the ordinary path's exact obstruction.
- An adapter has no named consumer or retained-state obligation.
- A named standard or engineering story is creating its own prerequisites.
- You cannot state how the result will be proved independently.

## Keep knowledge load-bearing

Write only what helps the next reader decide, operate, recover, or verify. Let code
explain what happens. Use comments for reasons, contracts, invariants, traps, and
invalidation conditions. Update the source of truth directly.

Lead communication with the outcome. Report meaningful evidence, decisions,
blockers, risk, and the next relevant action. Do not narrate routine tool use.

## Load specialist guidance only when needed

- Architecture or new abstractions: read `references/architecture.md`.
- Compatibility, versioning, or migrations: read `references/compatibility.md`.
- Engineering precedents and examples: read `references/examples.md`.
- `simple audit`: read `references/audit.md` and use objective crawling agents when
  available; keep architectural judgement with the lead agent.
- `simple init`, `plan`, `review`, or `check`: read `references/commands.md`.
- Comments, Markdown, prompts, or technical prose: read `references/writing.md`.
- Refactoring or deletion: read `references/refactoring.md`; for deletion tooling,
  also read `references/deletion-tools.md`.
- Plans, progress, reviews, or handoffs: read `references/communication.md`.
- Repository initiation or profile changes: read `references/profile-template.md`,
  then run `scripts/simple.mjs init` or `scripts/simple.mjs check`.

Keep the implementation, tests, comments, documentation, and handoff consistent.
