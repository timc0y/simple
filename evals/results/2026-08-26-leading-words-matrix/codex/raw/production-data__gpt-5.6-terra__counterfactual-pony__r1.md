Use one stored field with the new name, renamed through the existing schema-migration mechanism. Preserve the old API name only at the public boundary for 90 days; do not keep duplicate columns or dual-write data.

1. Add a reversible migration that renames the persisted field from `<old>` to `<new>`. It must preserve every value and have a tested down migration that restores the old column name.

2. Change service/domain code to use only `<new>`. This makes the new persisted name the single source of truth.

3. Add one bounded API compatibility mapper:
   - Old API representation maps `<old>` to `<new>` on input and maps `<new>` back to `<old>` on output.
   - New API representation exposes `<new>`.
   - If a request can send both names, reject conflicting values rather than choosing silently.

4. Keep the old representation available until the 90-day promise ends. Use the service’s existing API-version or route-selection mechanism. If none exists, the unresolved decision is how clients select the old versus new response shape; do not invent a second mechanism without establishing that fact.

5. Prove:
   - Migrated stored records retain their values.
   - Old clients can read and write the old representation.
   - New clients can read and write the new representation.
   - Migration rollback restores the former schema without data loss.
   - Removal occurs only after 90 days and confirmed old-client traffic is zero.

After that condition is met, remove the API mapper, old representation tests, and the down-migration support if the project’s migration-retention policy permits it.
