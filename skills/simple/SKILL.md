---
name: simple
description: >-
  Simplify architecture, implementation, workarounds, refactors, APIs, comments,
  documentation, plans, and technical explanations. Use before non-trivial
  design or implementation and whenever a solution adds abstractions,
  compatibility, configuration, indirection, persistent state, parallel
  workflows, cleanup, or speculative flexibility.
---

# Simple

Design for observed reality, not imagined obligations.

Simple is the smallest truthful model that preserves required behaviour, safety,
intent, and proof. Optimize for fewer concepts, states, workflows, and decisions—not
fewer files or lines.

Surface uncertainty that could change the solution; otherwise state the assumption
and proceed. Make the smallest coherent change, touch no unrelated code, remove the
orphans your change creates, define observable success, and loop until it is proved.

Read the nearest `SIMPLE.md` when one exists. Its repository facts and precedents
override generic assumptions. Run `scripts/simple.mjs check` after changing the
profile or its instruction route. Read `references/deletion-tools.md` when the task
is substantially about removing code, dependencies, compatibility, or architecture.

## Establish the real obligations

Before preserving or adding complexity, establish:

- actual users and operators
- external consumers and public contracts
- persistent data and migration obligations
- required compatibility
- observed variation
- current scale and failure consequences

Existing code is not evidence that its concepts are required. Delete architecture
serving obligations that do not exist. Do not confuse “no users” with “no state”:
check data, automation, published interfaces, and downstream repositories separately.

## Reuse the ordinary path

1. Observe the real system.
2. Name the owner and its ordinary successful path.
3. Reduce the exception to that path with the smallest native adapter.
4. Hide necessary complexity behind the owner.
5. Prove behaviour through an independent surface.
6. Delete the displaced route, state, abstraction, cleanup, and explanation.

Prefer one owner over coordinated layers, a deep module over pass-through modules,
native behaviour over simulation, and replacement over compatibility when no real
contract requires compatibility. Do not add an abstraction until two current cases
vary in the same owned knowledge.

## Make complexity pay rent

For a non-trivial design, answer:

```text
Observed need:
Existing owner:
Ordinary path:
Smallest native adapter:
Real compatibility or migration obligation:
New persistent state:
Failure and cleanup states:
Concepts, states, or workflows removed:
Independent proof:
```

If nothing is removed, challenge the design again.

## Preserve hard-won reductions

A repository precedent records an expensive discovery in a reusable form:

```text
Need:
Tempting complexity:
Observed native fact:
Simple solution:
Why sufficient here:
Invalidation condition:
Concepts avoided:
```

Reuse its reasoning, not blindly its implementation. Reconsider it when its
invalidation condition becomes true. Record only non-obvious precedents that prevent
a plausible return to substantial complexity.

## Expose the model

Keep policy with its owner. Validate at the owning boundary. Use linear control flow
and explicit state transitions. Extract shared knowledge, not incidental syntax.

Use an AST for broad syntax-aware transformations and a direct patch for local edits.
Preserve unsupported syntax, comments, formatting, and semantic evidence.

Code states what happens. Comments preserve why, guarantees, invariants, assumptions,
traps, and invalidation conditions. Delete comments that narrate syntax.

Write precise technical English. Use established terms when they compress meaning
accurately. Lead with the result, keep one term per concept, and separate fact,
inference, and unknown. Preserve contracts and failure modes; remove ceremony.

## Finish

Code, tests, comments, documentation, and the handoff must describe the same model.
Inspect the final diff: every changed line must serve the requested outcome or remove
complexity displaced by it.

```text
Outcome:
Why sufficient for observed reality:
What was removed:
Proof:
Remaining risk or invalidation condition:
```
