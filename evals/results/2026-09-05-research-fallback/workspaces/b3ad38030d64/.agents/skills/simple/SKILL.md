---
name: simple
description: >-
  Apply first-principles reasoning grounded in repository evidence to find the
  smallest truthful software design and write concise, plain developer prose. Use
  for architecture, ownership, refactoring, deletion, compatibility, migration,
  repository audits, decision reviews, implementation plans, or work that is becoming more complex
  than its demonstrated requirements; for technical plans, documentation, comments,
  Markdown, prompts, reviews, updates, and handoffs; and when asked what a documented
  engineer, company, or operator would do. Read the nearest SIMPLE.md when repository
  facts change the answer.
---

# Simple

Apply first-principles reasoning to find the least complicated solution that fully
accounts for the obligations that actually exist. Truthful means supported by observed
requirements, repository facts, or explicit commitments—not hypothetical future needs.

Before a decision whose implementation could change with repository facts, read the
nearest `SIMPLE.md`. If a material fact is absent, establish it or state the
uncertainty. Absence of evidence grants neither an obligation nor deletion permission.

## Choose the mode

- `design`: use the repository facts and decision method for architecture, ownership,
  compatibility, migration, deletion, refactoring, or system-shape decisions.
- `writing`: create or revise plans, documentation, comments, Markdown, prompts,
  reviews, updates, and handoffs as concise, plain, load-bearing prose.

Writing is a first-class Simple mode. Do not turn a writing task into an architecture
review unless the content itself requires a design decision. Read the nearest
`SIMPLE.md` only when repository facts materially change what the writing must say.

## Solve with the human

1. Treat a requested implementation as a proposal until the underlying problem is
   clear. Restate who or what is affected, what happens now, what should happen, and why
   the difference matters.
2. Establish the actual users, operators, consumers, contracts, retained data,
   commitments, scale, and failure consequences. Separate observed facts and explicit
   commitments from inference, assumptions, and unknowns. Find repository facts before
   asking the human; ask when their intent or a material choice is missing.
3. State the required outcome or invariant without naming the current implementation.
   Find the existing owner and ordinary path, then name the exact obstruction.
4. Decide what must be preserved and what may be replaced. Before moving ownership or
   adding a workflow, try to supply only the missing precondition through the ordinary
   path.
5. Choose the smallest design that satisfies those present obligations. Before adding
   code, a dependency, an abstraction, a workflow, or another owner, walk the ladder in
   `references/architecture.md`.
6. Make the reasoning easy to inspect: current reality -> obstruction -> change ->
   outcome. Recheck the proposed change against the original problem and revise any
   part that does not help.
7. Remove the route, state, explanation, and cleanup displaced by the change. Try to
   falsify the result through a surface independent enough to distinguish the requested
   behaviour from the implementation itself.

## Write in order

1. Identify the reader, purpose, destination, and source of truth.
2. Preserve every material fact, decision, constraint, caveat, and next action.
3. Answer the reader's main question first. Group the reasons and evidence beneath the
   answer, and put each detail beside the point it supports.
4. Choose the smallest structure that makes the content easy to understand and use.
   When a flow, relationship, comparison, or change is hard to picture in prose, use a
   short example or the smallest useful visual.
5. Write direct sentences with one term per concept and explicit actors where needed.
6. Use plain Markdown: few headings, shallow lists, restrained emphasis, and no
   decorative formatting unless the destination requires it.
7. Remove generic introductions, repetition, filler, and formatting that carries no
   meaning.
8. Check that compression did not remove a reason, boundary, risk, proof, or unknown.

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
- `simple board`: read `references/board.md` and `references/model-profiles.md`. Use
  optional independent views for consequential decisions; synthesise in the lead.
- `simple init`, `plan`, `review`, `write`, `emulate`, or `check`: read
  `references/commands.md`.
- Plans, documentation, comments, Markdown, prompts, reviews, updates, or handoffs:
  read `references/writing.md`. Use writing mode without expanding into design
  analysis unless the content requires it.
- Asked what a documented engineer, company, or operator would do: read
  `references/operator-emulation.md` and only the selected lens file. Emulate the
  documented doctrine, never the persona, and only when requested.
- Adapting guidance to a model or harness: read `references/model-profiles.md`.
- Refactoring or deletion: read `references/refactoring.md`; for deletion tooling,
  also read `references/deletion-tools.md`.
- Any task that creates, reviews, or changes `SIMPLE.md`: always read
  `references/profile-template.md` before you write. Run `scripts/simple.mjs init` or
  `scripts/simple.mjs check` when the task needs it.

Keep the implementation, tests, comments, documentation, and handoff consistent.
