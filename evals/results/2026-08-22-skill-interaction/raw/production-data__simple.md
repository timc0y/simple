## Renaming a persisted field + its API representation

**Obligation (from SIMPLE.md):** real old and new API clients exist and must both keep working for 90 days; customer records must not be lost; schema changes go through the existing migration mechanism. This is the "real old and new callers" case in `compatibility.md` — the answer is one bounded adapter with an exit condition, not a new API version, feature flag, or shadow system.

**Ordinary path:** the existing migration mechanism owns schema change; the existing serializer/mapper layer owns the field's API name. Neither needs a new owner — they need to run twice, once for each name, for 90 days.

### Implementation

1. **Migration (via the existing mechanism), additive only**
   - Add the new column under the new name.
   - Backfill it from the old column in the same migration.
   - Keep both columns present and synced for the duration of the deprecation window (write path updates both, or the migration adds a DB-level sync if the schema tooling supports it). Do not drop or rename the old column yet — that would break rollback and any code not yet touched.

2. **Write path**
   - The single write path sets both columns to the same value. This is one code change, not a dual-write system — there is one source of truth (the value), just two persisted names during the transition.

3. **API representation**
   - Serializer emits both the old and new field names in every response, same value, old one marked deprecated in the API docs (and, if the service already has a mechanism for it, a deprecation header/notice — don't add a new one just for this).
   - Deserializer accepts either field name on input; if both are sent, prefer the new name and log a conflict rather than silently picking one.

4. **Removal (after the 90 days AND old-client traffic is zero)**
   - Drop the old field from the API contract.
   - Drop the old column via the existing migration mechanism.
   - Remove the dual-write/sync code.

### Proof

- **Stored data:** after migration, every row's new column equals the old column's prior value; run this as a verification query, not a spot check.
- **Both API representations:** contract test hits the endpoint reading and writing the old field name, and separately the new one, asserting identical stored value and identical round-trip.
- **Rollback:** revert the deploy (not the migration) and confirm old-name-only clients still work, since the old column is untouched and still authoritative until removal.
- **Removal criteria:** old-field usage must be observable (existing request logging/metrics, not a new system) so "zero old-client traffic" is a measured fact, not an assumption, before the removal migration ships.

### What this avoids

No API versioning, no feature flag, no permanent adapter. The dual name/column is temporary, has a named exit condition (90 days + zero old traffic), and both consumers are proved through the ordinary read/write path — nothing new is being owned or kept alive past its rent.
