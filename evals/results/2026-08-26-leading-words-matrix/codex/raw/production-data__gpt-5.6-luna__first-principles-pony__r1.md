## Proposed implementation

Keep the new name canonical in the service, and contain compatibility at the API and migration boundaries.

1. Add the new persisted field with the existing migration mechanism. Keep the old field temporarily.

2. Backfill the new field from the old field. Make the migration resumable and verify row counts plus null/conflict cases.

3. Update the service model and normal reads to use the new field. During the 90-day window, write both fields so the previous application version remains rollback-safe. Treat the new field as authoritative if values differ.

4. Add one bounded API adapter:

   - New clients use the new representation.
   - Old clients may send and receive the old representation.
   - The adapter translates the old name to the canonical new field.
   - Validation remains in the existing service boundary.

5. Add independent tests for:

   - Old data becoming readable through the new field.
   - Old and new API requests and responses.
   - Writes remaining readable by the previous application version.
   - Migration rollback or recovery.
   - Old/new field conflicts and null values.

6. After 90 days, when old-client traffic is zero, remove the old API mapping and drop the old persisted field in a separate migration. Remove its tests and monitoring at the same time.

The exact field names, API versioning mechanism, conflict policy, and rollback command are not present in the repository, so those must be resolved before implementation. No permanent dual representation, feature flag, or new abstraction is needed beyond the promised transition.
