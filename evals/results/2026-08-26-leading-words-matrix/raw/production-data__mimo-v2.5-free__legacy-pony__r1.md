Let me load the relevant reference guidance for this design task.Let me also read the refactoring and examples references, since this is a rename-and-migrate task.Now I have the full context. Here is the Simple-designed implementation plan.

---

## Plan: Rename a Persisted Field and Its Public API Representation

### Obligations (from `SIMPLE.md`)

- **External consumers**: Published API clients—old and new—must work for 90 days.
- **Retained data**: Customer records in production storage.
- **Ordinary path**: Schema changes go through the service's existing migration mechanism.

### Design

**1. Add the new column.**

Run a non-destructive migration: `ALTER TABLE ADD COLUMN new_name <type>`. Existing rows get a null or default value for the new column. The old column stays untouched.

**2. Write a bounded adapter.**

At the API serialization boundary (the layer that maps internal records to API responses), serve both field names:

- **Reads (GET)**: Output both `old_name` and `new_name` in responses, pointing at the same value. `old_name` is populated from the existing column; `new_name` from the new column. On write, accept either field name and write to both columns.
- **Writes (POST/PATCH)**: Accept `new_name`. If `old_name` is present instead, write to both columns. The adapter is the single point where old-name ↔ new-name translation happens.

No dual-write, no shadow system, no feature flag. One adapter at one boundary.

**3. Backfill.**

One migration job copies `old_name` → `new_name` for existing rows. This runs once, idempotently, behind the existing migration mechanism.

**4. Remove after the exit condition.**

When the 90-day deprecation period ends and old-client traffic reaches zero:

- Drop the read/write support for `old_name` from the adapter.
- Run `ALTER TABLE DROP COLUMN old_name`.
- Remove the adapter.

### What must be preserved

- The `old_name` column in storage until the deprecation window closes.
- `old_name` in API responses for old clients.
- `old_name` accepted in API writes during the window.

### What is replaced

- The public API contract shifts to `new_name` as the canonical field.
- Internal code references migrate to `new_name` incrementally (no deadline required during the window).

### Proof (from `SIMPLE.md`)

Verify:
1. Stored data—rows have both columns populated after backfill.
2. API output—old clients reading `old_name` and new clients reading `new_name` both receive correct values.
3. API input—writes to `old_name` and `new_name` both persist.
4. Rollback—dropping `new_name` column and removing the adapter reverts to the original single-column state.
5. Removal—after 90 days, `old_name` column and adapter code are deleted; new-client traffic unaffected.

### Reconsider when

The deprecation period ends and old-client traffic reaches zero.

---

This is the smallest design that satisfies the 90-day obligation: one adapter at the serialization boundary, one migration to add the column, one backfill, and a clear removal trigger. No new abstractions, no feature flags, no parallel systems.
