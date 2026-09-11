---
name: simple
description: >-
  Apply first-principles reasoning grounded in repository evidence to find the
  smallest truthful software design and write concise, plain developer prose. Use
  for architecture, ownership, refactoring, deletion, compatibility, migration,
  repository setup or reconciliation, audits, decision research, reference implementations, fallbacks, implementation plans,
  or work that is becoming more complex than its demonstrated requirements; for
  debugging, performance, verification and implementation through review;
  technical plans, documentation, comments, Markdown, prompts, reviews, updates, and
  handoffs; and when asked what a documented engineer, company, or operator would do.
  Read the nearest SIMPLE.md when repository facts change the answer.
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
- `research`: resolve a decision-changing uncertainty using existing implementations,
  sources and bounded experiments. Read `references/research.md`.

Choose from the requested outcome, not a keyword: a review may ask for an explanation,
a comparison, or defects. Do not silently substitute one for another.

Writing is a first-class Simple mode. Do not turn a writing task into an architecture
review unless the content itself requires a design decision. Read the nearest
`SIMPLE.md` only when repository facts materially change what the writing must say.

## Solve with the human

1. Establish who or what is affected, what happens now, what should happen, and why
   the difference matters. Use the existing conversation when it already answers this.
   Clarify a material ambiguity; do not make the human reconfirm a clear request.
2. Establish the actual users, operators, consumers, contracts, retained data,
   commitments, scale, and failure consequences. Separate observed facts and explicit
   commitments from inference, assumptions, and unknowns. Find repository facts before
   asking the human; ask when their intent or a material choice is missing.
3. State the required outcome or invariant without naming the current implementation.
   Find the existing owner and ordinary path, then name the exact obstruction.
   Before substantial invention, look for knowledge in working implementations,
   official clients, tests and previous fixes. Research only what can change the decision.
4. Decide what must be preserved and what may be replaced. Before moving ownership or
   adding a workflow, try to supply only the missing precondition through the ordinary
   path.
5. Choose the smallest design that satisfies those present obligations. Before adding
   code, a dependency, an abstraction, a workflow, or another owner, walk the ladder in
   `references/architecture.md`. Compare the work left to implement, understand,
   verify and maintain. An existing tool that completes the job is a completed solution.
6. Make the reasoning easy to inspect: current reality -> obstruction -> change ->
   outcome. Recheck the proposed change against the original problem and revise any
   part that does not help.
7. Remove the route, state, explanation, and cleanup displaced by the change. Try to
   falsify the result through a surface independent enough to distinguish the requested
   behaviour from the implementation itself.

The requested outcome defines success. Tests and metrics supply evidence about it;
check what they actually exercise before using a score to change the requirements.
Investigate failures without discarding wanted capabilities merely to improve a score.

A correction changes the affected premise, not the entire brief. Preserve the active
outcome, unaffected requirements, accepted decisions, and existing authorization.
A status question does not cancel ongoing work. Informal wording or a transcription
error does not establish a new API, identifier, or compatibility promise.

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
- One requirement stated in the request, rather than a repository fact, is the exact
  obstruction to a materially simpler design.
- A supposedly primary path routinely fails while only its fallback works.
- An adapter has no named consumer or retained-state obligation.
- A named standard or engineering story is creating its own prerequisites.
- You cannot state how the result will be proved independently.

## Keep knowledge load-bearing

Write only what helps the next reader decide, operate, recover, or verify. Let code
explain what happens. Use comments for reasons, contracts, invariants, traps, and
invalidation conditions. Update the source of truth directly.

Preserve expensive discoveries where the next change needs them: the evidence,
working approach and observable reason to recheck. Prefer an existing test, nearby
comment or knowledge owner over another report. Keep project-specific findings out
of shared guidance.

Lead communication with the outcome. Report meaningful evidence, decisions,
blockers, risk, and the next relevant action. Do not narrate routine tool use. Do not
stop to report while assigned, unblocked work remains; finish it, then report once.
Stop early only for a blocker the human alone can clear, and name it as the last line.

## Load specialist guidance only when needed

- Bugs, regressions, performance or runtime traces: read `references/diagnosis.md`.
- Type design, state variants or trust-boundary validation: read `references/types.md`.
- History recovery, repeated working conventions or skill improvement: read `references/learning.md`.
- Product verification, test-first work or visual parity: read `references/verification.md`.
- Prototypes, competing implementations or measured improvement: read `references/experiments.md`.
- Dependent feature work, review follow-through, authorized release or safe pause:
  read `references/delivery.md` and `references/repository-work.md`.
- Architecture or new abstractions: read `references/architecture.md`.
- Decision research, package selection or learning from a reference implementation:
  read `references/research.md`. Use a brief lookup for a narrow question.
- Compatibility, versioning, or migrations: read `references/compatibility.md`.
- Engineering precedents and examples: read `references/examples.md`.
- `simple audit`: read `references/audit.md` and use objective crawling agents when
  available; keep architectural judgement with the lead agent.
- `simple board`: read `references/board.md` and `references/model-profiles.md`. Use
  optional independent views for consequential decisions; synthesise in the lead.
- `simple init`, `work`, `reconcile`, `plan`, `review`, `write`, `round`, `emulate`, or
  `check`:
  read `references/commands.md`. For repository setup, end-to-end work, reconciliation,
  swarm coordination, or release handoff, also read `references/repository-work.md`.
- A status question during work that spans sessions or a compaction: read
  `references/commands.md` under `simple round`.
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

Before handing off a task that changed repository files, update each existing truth
owner made false by the change. An ordered queue contains only unfinished work, so
remove completed instructions instead of marking them done. Delete a temporary plan,
review, audit, status note, or handoff after its work or evidence has moved to the
durable owner; Git preserves its history. Leave unrelated documents alone. Never delete
a decision, contract, retained evidence, recovery path, or unknown obligation.

Keep the implementation, tests, comments, documentation, and handoff consistent.
