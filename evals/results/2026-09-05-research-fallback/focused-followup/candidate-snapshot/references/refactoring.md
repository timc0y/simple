# Refactoring

Use this when consolidating, replacing, or deleting implementation.

## Change one ownership boundary

1. Define the behaviour and contracts that must remain.
2. Find the current owners, callers, state, cleanup, and documentation.
3. Move the ordinary path to one owner.
4. Remove the displaced path and its orphans.
5. Prove behaviour independently of the deleted implementation.

Do not preserve an obsolete interface merely because tests target it. Move tests to
the real contract when no external consumer needs the old surface.

Search for dynamic entry points, configuration, reflection, generated code,
downstream imports, persisted identifiers, and operational scripts before deletion.
Use `deletion-tools.md` when tooling is needed to find or prove candidates.

Inspect the final diff. Every changed line must serve the requested outcome or remove
complexity displaced by it.
