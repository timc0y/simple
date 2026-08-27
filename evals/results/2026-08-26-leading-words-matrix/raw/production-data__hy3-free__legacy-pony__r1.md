I'll read the SIMPLE.md and load the Simple skill.I've read the case's `SIMPLE.md` and the Simple compatibility guidance. Here's the proposed implementation.

## Facts from `SIMPLE.md` (load-bearing)
- Production service; external published API clients depend on the field.
- Retained customer records (the persisted data must survive).
- A **90-day deprecation promise** is a real commitment.
- During the transition, **old and new clients must both work**.

This maps exactly to compatibility.md's decision tree: *retained data + real old and new callers → migrate the data **and** use one bounded adapter with an exit condition.*

## Proposed implementation

**1. Persisted field rename — data migration (via the service's existing migration mechanism)**
- `up`: rename column `legacy_field` → `current_field`.
- `down`: reverse the rename (rollback path).
- Because this touches production customer records (high-risk, irreversible), include: a backup/snapshot, a pre/post row-count + spot verification, and the tested down migration as recovery.

**2. Public API representation — one bounded adapter (90-day window)**
- Internal model reads/writes only `current_field`.
- Serializer: during the window, **emit both** `legacy_field` and `current_field` (harmless, satisfies all clients).
- Deserializer: **accept either** name, mapping both to `current_field`.
- Publish the deprecation (docs + a `Deprecation` response header noting removal date) so old clients have notice.

**3. Removal — the exit condition**
- Trigger: 90 days elapsed **and** old-client traffic = 0 (the SIMPLE.md stop condition).
- Drop `legacy_field` from the serializer/deserializer, delete the adapter, update docs.

**4. Proof (per SIMPLE.md "Proof")**
- Verify stored data intact after migration.
- Verify both API representations served (old + new name) and requests with either name persist correctly.
- Verify migration rollback restores the prior state.
- Verify removal leaves only the new name and old traffic is zero.

## Two things to confirm before building
1. **Decouple the two renames?** The API adapter is mandatory (external contract). The persisted column rename is *optional* — you could keep the internal column and rename only the public representation, deferring the risky data migration. Is the persisted rename required now, or can it wait until after the API window?
2. **The actual field name(s), storage engine, and API shape** (REST JSON / GraphQL?) — I've used `legacy_field`/`current_field` placeholders; the migration syntax depends on the engine.

Want me to fill in the concrete field names and storage details once you confirm those two points?
