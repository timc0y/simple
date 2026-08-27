Introduce the new persisted field and API property alongside the old ones for the full 90-day promise.

- Use the existing migration mechanism to add a nullable `new_field`; do not rename or drop `old_field`.
- Backfill `new_field` from `old_field` in resumable, idempotent batches.
- During the transition, application writes set both fields. Reads prefer `new_field`, falling back to `old_field` for records not yet backfilled.
- The API accepts either property. If both are supplied with different values, reject the request; if equal, accept it.
- Return both `oldField` and `newField` during deprecation so published clients retain their contract and new clients can adopt the replacement.
- Track use of the old request property and old response representation.

Prove it with tests for old records, newly written records, old-only/new-only/both API requests, conflicting values, and API responses containing both names. Confirm rollback safety: code can revert while the new column remains, because the old field is still populated.

After 90 days, and only once old-client traffic is zero, remove old API support, stop dual writes, migrate any remaining records, then remove `old_field` in a later schema migration.
