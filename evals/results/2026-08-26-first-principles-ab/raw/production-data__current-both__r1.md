## Proposal: rename a persisted field and its public API representation

**Obligation (from SIMPLE.md):** production data and the published API contract must both survive a 90-day window in which old and new clients keep working. Schema changes go through the existing migration mechanism. No field names were given in the prompt, so this is written against placeholders — `old_name` (current) → `new_name` (target) — substitute the real names before implementing.

### Classify the obstruction

This is the compatibility playbook's "real old and new callers" case, not "no consumers" or "retained data with no old callers." Two different obligations sit at two different boundaries, and they don't need the same fix:

- **Storage**: no external caller touches the column directly. A column rename is metadata-only in the ordinary migration mechanism (e.g. `ALTER TABLE ... RENAME COLUMN`) — data isn't moved or copied, so there's nothing to dual-write or backfill. Do this in one migration, run once.
- **Public API**: external clients do touch this. Some still send/expect `old_name`; new ones use `new_name`. This is the one boundary that needs a bounded adapter.

Don't let the API compatibility need leak backward into the schema (no shadow column, no dual-write) — that machinery would exist for zero callers, since nothing reads the raw column except the API serializer.

### Implementation

**1. Storage — single migration, no adapter**
Rename the column via the existing migration mechanism. If the mechanism can't do an in-place rename safely for this table's size/traffic, that's a fact to establish before proceeding (lock behavior, replication lag) — don't assume expand/contract is needed without evidence it's required.

**2. Domain/application code**
Update all internal reads/writes to `new_name`. This is a one-time mechanical rename; there is no reason for internal code to know the old name at all.

**3. API boundary — the one bounded adapter**
At serialization only:
- **Inbound**: accept `old_name` and `new_name` on write requests; if both are present, treat it as a client error (ambiguous) rather than silently picking one.
- **Outbound**: emit both `old_name` and `new_name` with the same value on every response, for the duration of the deprecation window.
- Mark `old_name` as deprecated in the API docs/schema now, with the removal date.

Keep this shim entirely in the serialization layer — the domain model, database, and business logic never see `old_name`. That's the one clear owner; nothing else in the system should grow a second name for this field.

### Proof

- **Stored data**: confirm the migration preserves existing values (row count and spot-check values equal pre/post migration) and that it's reversible (rename back) in case of rollback.
- **Both API representations**: contract test that writes via `old_name` and via `new_name` produce the same stored value, and that reads return both keys with matching values.
- **Rollback**: verify reverting the migration and the serializer change independently — the serializer shim can roll back without touching the schema, and vice versa, since they're decoupled changes.
- **Removal criteria**: track `old_name` usage on inbound requests. Remove the adapter (stop accepting/emitting `old_name`) when the 90-day window elapses AND old-client traffic has reached zero — per SIMPLE.md's reconsideration condition. If traffic hasn't reached zero at day 90, that's a decision to escalate, not a reason to silently extend the shim.

### What this deliberately avoids

No API versioning, no feature flag, no dual-write to two columns, no permanent alias. The adapter is bounded (serializer only) and has a named exit condition (deprecation period elapsed + zero old-client traffic), matching "one bounded adapter with an exit condition" rather than building general-purpose field-renaming infrastructure for a single rename.
