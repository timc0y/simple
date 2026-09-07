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

Name the fact that makes the change safe, then check dependencies that symbol search
misses: stored values, remote consumers and required operation order. For example,
removing a caller does not prove that old records no longer contain its serialized
identifier. This adapts [PStack's blast-radius workflow](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/blast-radius/SKILL.md).

For repeated edits, prove one representative transformation before applying it
broadly. Reuse an existing codemod or command when it removes more work than it adds;
make reruns safe and inspect exceptions. A local edit needs no automation project.
This follows [PStack's build-the-lever principle](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-build-the-lever/SKILL.md).

Inspect the final diff. Every changed line must serve the requested outcome or remove
complexity displaced by it.

If input and output operations obscure a decision, consider a small pure function
for that decision. Keep effects with the current owner. Extract only when this makes
proof simpler or removes duplicate policy; a short linear operation needs no split.

For a consequential deletion, state the safety-critical fact and its proof strength:
directly exercised, supported by source and history, or still unproved.
Inspect the actual installed dependency source when a library contract decides that fact.
Report cleared risks and unresolved risks separately. A confidence label does not replace the evidence.
