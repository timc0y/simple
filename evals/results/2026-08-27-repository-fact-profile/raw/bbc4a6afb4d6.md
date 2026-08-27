Rename the stored field through the existing migration mechanism, while serving both API names for 90 days.

1. Add a migration that renames/backfills the persisted column from `old_field` to `new_field`, with a reversible rollback. Make `new_field` the sole stored source of truth.

2. Update service code to read and write only `new_field`.

3. At the API boundary, accept both `old_field` and `new_field` during the deprecation period, normalize either to `new_field`, and return the representation required by each supported API contract. Reject requests that supply conflicting values.

4. Mark `old_field` deprecated in the published API documentation and record its removal date and zero-traffic criterion.

5. Verify migrated customer records, old and new API requests/responses, migration rollback, and that old-client traffic is zero after 90 days. Then remove the old API adapter and any deprecated representation.

This keeps one data owner and one compatibility adapter, without dual writes or parallel storage.
