I'll start by reading the case's SIMPLE.md and understanding the project structure.This is a methodology case — there's no codebase to edit, the task is to apply the `SIMPLE.md` reality to propose an implementation. Here's the plan grounded in the Simple framework.

## Reality (what constrains us)
- **Production service, external published API clients**, retained customer records, and a **90-day deprecation promise**.
- During the window, **old and new clients must both work** (Current boundary), and we must **preserve customer data + the published contract** (Preserve).
- Schema changes go through the **existing migration mechanism** (Ordinary paths).

## Core decision
Do **not** do a destructive single-step rename. The smallest truthful design is **add → dual-expose → remove**, so neither data nor old clients break mid-contract.

## Proposed implementation

**Phase 1 — Additive persistence (non-destructive)**
- Add the new column/field alongside the old one via the existing migration mechanism; **do not drop the old column**.
- Implement **dual-write**: every write populates both old and new fields from one internal source of truth.
- **Backfill** existing retained records (one-time migration: copy old → new).
- Internally normalize reads to a single canonical representation; the old field becomes a write/read alias.

**Phase 2 — API representation (contract-preserving)**
- During the 90-day window, **responses emit BOTH** the old and new field names (old clients keep working; new clients adopt the new name).
- **Accept both** names on input: map the old name to the new canonical field, new name takes precedence.
- This satisfies "old and new clients must work during the promised transition."

**Phase 3 — Proof (verify per SIMPLE "Proof")**
- Stored data: backfill + dual-write keep old and new in sync; spot-check retained records.
- Both API representations: old client gets old name, new client gets new name (or both).
- Rollback: trivial — old field and old API name still exist, so disable the dual path to revert.
- Removal criteria: **only after 90 days AND old-client traffic = 0** (the Reconsider trigger).

**Phase 4 — Removal (after the trigger)**
- Stop emitting the old API name; stop accepting it on writes.
- Migration to drop the old column.
- Re-verify the new name end-to-end.

## Open parameters I'd need to fill in
These aren't specified in the case and shouldn't be assumed:
1. The **old/new field names** and whether the persisted name and the API name are the same or independently renamed.
2. The **stack** (DB + ORM/migration tool, API framework/style — REST vs GraphQL) so Phase 1–2 land in the codebase's ordinary paths.

Want me to tailor Phases 1–2 to a specific stack, or is the framework-level plan what you need?
