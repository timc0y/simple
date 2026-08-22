Ran the Simple design method against this case. Here's the proposal.

## Obligation (from SIMPLE.md)

Two different compatibility problems, not one:

- **The database column**: no external consumer reads it directly — only the service's own code does. There are no "old callers" of the schema itself.
- **The API field name**: published clients read and write it directly, and a 90-day deprecation promise binds the service to keep old clients working.

Per `compatibility.md`, these get different treatment: retained data with no old callers → migrate the data, not the interface. Real old and new callers → one bounded adapter with an exit condition. Collapsing both into one mechanism (e.g., keeping the old DB column around "just in case," or building a generic field-versioning system) would be paying for a compatibility problem that only exists at the API boundary.

## Persisted layer: rename outright, once

Use the existing migration mechanism to rename the column directly (e.g., `rename_column` / `ALTER TABLE ... RENAME COLUMN`). No dual column, no backfill job, no shadow write — there is no consumer of the raw schema to keep satisfied, so the ordinary migration path fully closes this obligation. Rollback is the same mechanism run in reverse.

## API layer: one bounded adapter, with a named exit condition

At the serialization boundary only:

- **Read**: response payloads include both the old and new field names during the deprecation window, both sourced from the single renamed column. No second source of truth is created — it's one value, two keys.
- **Write**: accept either key; if both are present, the new key wins. This is the adapter — small, owned by the serializer, and not spread into business logic or storage.
- **Observability**: count requests that use the old key. This is what turns "90 days" from a calendar guess into a real removal trigger and is exactly the "old-client traffic reaches zero" condition SIMPLE.md's "Reconsider when" names.

## Exit condition

Remove the adapter when both are true: the 90-day window has elapsed, and old-key usage has reached zero. Removal means deleting the old key from responses and the acceptance branch on writes — nothing else, since no other part of the system depended on the old name.

## Proof, mapped to SIMPLE.md's four checks

- **Stored data**: migration test — row values are identical before and after, read back under the new column name.
- **Both API representations**: contract tests that write via the old key and read via the new key, and vice versa, confirming both directions resolve to the same stored value.
- **Rollback**: reverse-migration test restores the old column name with no data loss; run it against a copy of production-shaped data, not a fresh fixture.
- **Removal criteria**: a dashboard/alert on the old-key usage counter, checked against the 90-day date, is the concrete signal for when to delete the adapter — not a TODO comment or a calendar reminder alone.

No versioning scheme, feature flag, or generic compatibility framework is justified here — one migration plus one small, metered adapter covers the actual obligation, and both pieces have a stated removal path.
