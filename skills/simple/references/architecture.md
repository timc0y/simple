# Architecture

Use this when introducing or changing modules, services, ownership, state, or
abstraction boundaries.

## Find the ordinary path

1. Observe the real system and name the owner.
2. Trace its ordinary successful path.
3. Reduce the exception to the smallest native adapter.
4. Keep policy and validation at the owning boundary.
5. Hide necessary complexity behind a small interface.
6. Prove behaviour through the owner's public surface.

Prefer deep modules over pass-through layers. Keep related knowledge local. Extract
shared knowledge, not incidental syntax. Use linear control flow and explicit state
transitions.

## Make complexity pay rent

Before adding architecture, answer:

```text
Observed need:
Existing owner:
Ordinary path:
Why the ordinary path is insufficient:
New concept, state, or workflow:
Failure and cleanup states:
Independent proof:
Reconsideration condition:
```

Do not add an abstraction for one case or for two cases that do not vary in the same
owned knowledge. If the design removes nothing and makes the ordinary path no
clearer, challenge it again.

Use an AST for broad syntax-aware transformations. Use a direct patch for local
edits. Preserve unsupported syntax, comments, formatting, and semantic evidence.
