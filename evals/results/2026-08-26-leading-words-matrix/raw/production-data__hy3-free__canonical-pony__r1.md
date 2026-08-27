I'll check whether there's an actual codebase behind this case to ground the owner and ordinary path.No source code exists in this case directory, so this is a design proposal grounded in `SIMPLE.md`. Here it is.

## Proposal: rename a persisted field and its public API representation

### Observed facts (from `SIMPLE.md`)
- Production service; external **published API clients** depend on it.
- **Retained customer records** in persistent storage must survive.
- A **90-day deprecation promise** is a real commitment.
- During the transition, **old and new clients must both work**.

Unknowns that do not change the shape: the concrete field name, storage engine, language, and serializer. The plan uses placeholders.

### Required invariant (no implementation named)
Customer records are preserved, and every client (old or new) can read and write the field by its expected name for the full 90-day window, with a clean exit once old-client traffic reaches zero.

### Existing owner and ordinary path
- **Persistence:** the service's existing migration mechanism (stated in `SIMPLE.md`).
- **API shape:** the service's existing request/response serializer.
Reuse both. Do not add a parallel storage path.

### Exact missing capability
The internal field and the DB column take the new name, but old clients still send/receive the **old** public key for 90 days. The obstruction is a temporary name mismatch at the API boundary only — the data itself has one true owner (the renamed column).

### Smallest honest path
Per `compatibility.md`, with both retained data and real old callers, use **one bounded adapter with an exit condition** — at the serializer, not the database.

1. **Migrate the persisted field** through the existing migration mechanism:
   - Rename the column to the new name; data is carried by the rename (no row rewrite).
   - Provide a **down-migration** that restores the old column name for rollback.
   - Rename the internal domain/model property to the new name.
2. **Add one bounded API adapter** in the serializer (single owner):
   - **Request:** accept *both* old and new keys; write to the single new field. New key wins on conflict.
   - **Response:** emit *both* old and new keys from the single new field.
   - This is an alias, not dual storage — no second column, no dual writes, no shadow system.
3. **Add telemetry:** count requests that arrive with the old key. This is the sole signal for the exit condition.

### Preserve vs replace
- Preserve: customer data, the 90-day contract, both API representations during the window.
- Replace: the old public key in responses, and the adapter, after exit.

### Proof (each from `SIMPLE.md` Proof line, independently checkable)
- **Stored data:** old records load and round-trip under the new column via the down/up migration.
- **Both API representations:** an old-client contract test (old key in/out) and a new-client test (new key in/out) both pass against the running service.
- **Rollback:** applying the down-migration restores the old column and old clients pass again.
- **Removal criteria:** old-key request rate == 0 for the tail of the 90-day window.

### Exit (reconsideration condition)
When the deprecation period ends **and** old-key traffic is zero: delete the serializer adapter, stop emitting the old key, and retire the down-migration. No further DB change needed.

### What this deliberately avoids
No feature flag, no versioned API, no second data column, no permanent compatibility layer — the adapter is temporary and has a named removal trigger.

One open question before implementation: is the persisted rename a pure `RENAME COLUMN`, or does the storage layer require add-new/backfill/drop-old for safety? That choice stays inside the existing migration mechanism and doesn't affect the API adapter design.
