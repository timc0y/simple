# Architecture

Use this when introducing or changing modules, services, ownership, state, or
abstraction boundaries.

## Raptor: simplify the system boundary

SpaceX's Raptor evolution is a useful model for deep modules. Raptor 3 did not make
rocket engineering easy. It internalised secondary flow paths and cooling so exposed
plumbing, engine heat shields, and supporting vehicle hardware could be removed. The
engine became more capable inside and imposed less complexity on everything around
it.

Software simplification should work the same way: put unavoidable complexity behind
one clear owner, then remove the adapters, parallel paths, and support machinery that
the stronger boundary makes unnecessary. Judge the whole system, not the visible
line count of one component.

Sources: [SpaceX's Raptor comparison](https://x.com/SpaceX/status/1819795288116330594)
and [SpaceX's 2026 technical disclosure](https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf).

Use `examples.md` when another engineering precedent would expose the decision more
clearly. A precedent guides attention; it does not supply missing repository facts.

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

Add an abstraction when cases vary in the same owned knowledge and the boundary
removes complexity from its consumers. A useful design makes the ordinary path
clearer or removes a real obligation elsewhere.

Use an AST for broad syntax-aware transformations. Use a direct patch for local
edits. Preserve unsupported syntax, comments, formatting, and semantic evidence.
