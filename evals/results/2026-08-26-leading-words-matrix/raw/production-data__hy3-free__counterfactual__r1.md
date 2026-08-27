I have the design guidance. Now let me explore the actual repository to ground the proposal in real code.This is a synthetic case with no source code—only `SIMPLE.md` and `prompt.md`. The proposal below is grounded in the obligations that file states, using Simple's design method and the compatibility reference.

---

# Renaming a persisted field and its public API representation

## Context (from SIMPLE.md)
Production service, external published API clients, retained customer records, and a 90-day deprecation promise. During the window, old and new clients must both work, and customer data plus the published API contract must be preserved. Schema changes go through the existing migration mechanism.

This is the compatibility reference's "real old and new callers" case: **one bounded adapter with an exit condition**—not an API version, a shadow system, dual writes, or a permanent shim.

## Design

The persisted field and the API field are different layers. Rename them independently; join them only through the serialization mapping.

**1. Persisted field (internal — no external contract)**
- Use the existing migration mechanism to rename the column/field.
- Steps: take a verified backup/snapshot → add the new field → backfill values from the old field → verify row-count and value parity → keep the old field read-only as a rollback mirror until the end of the window (or rely on the backup if the engine makes column drop safe).
- This is a data migration. No client sees storage names, so it carries no compatibility obligation of its own.

**2. Public API representation (the published contract)**
- Add one bounded adapter in the request/response serialization layer. During the 90-day window it: accepts the old field name on writes (maps to the new storage field) and emits both old and new names on reads.
- Old clients keep using the old name; new clients use the new name; both read the same underlying value. This is the single compatibility path, with an explicit exit.

**3. Exit condition (SIMPLE.md "Reconsider when")**
- Remove the adapter only when **(a)** the 90-day period has ended **and (b)** measured old-field traffic reaches zero.
- Gate on the traffic signal, not the calendar: the counterfactual is that dropping the adapter while old clients remain breaks them.

**4. Observability**
- Emit a metric each time the old field name is received or emitted, so the removal criterion is measurable.

## Proof (SIMPLE.md "Proof")
- **Stored data:** after backfill, assert every retained record has the value in the new field with parity against the old; no records lost.
- **Both API representations:** integration tests where an old client (old name) and a new client (new name) read/write the same record and see consistent values.
- **Rollback:** the migration is reversible via the reverse migration + backup snapshot; the adapter is additive code, so removing it cannot lose data. Document exact rollback steps.
- **Removal criteria:** the metric shows old-field traffic at zero after day 90; only then delete the adapter and (if still present) the old column.

## Preserve vs replace
- **Preserve:** all customer data; old-client functionality until removal.
- **Replace:** the old API field name and the old persisted column, both only after the window.

## Facts to confirm before implementation
- The actual field/column name and the endpoints that carry it (read-only or writable).
- The identity of the existing migration mechanism and how renames/backfills are done safely here.
- How client traffic is attributed, so the old-field metric can distinguish old clients.
- Whether the old field appears in request bodies—if response-only, the adapter only needs to emit both names.

This avoids dual writes, feature flags, and a permanent second API version; it uses the one existing migration path and one time-bounded serialization shim.
