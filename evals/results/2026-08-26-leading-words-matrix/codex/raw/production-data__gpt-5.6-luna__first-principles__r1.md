The smallest implementation is one canonical new field with a temporary compatibility adapter at the API boundary.

1. Use the existing schema migration mechanism to rename the persisted field, preserving its type, nullability, default, indexes, constraints, and values. Verify row counts and value checksums before and after migration.

2. Update the domain model and internal code to use only the new field name.

3. Keep the public API compatible for 90 days:

   - New clients read and write the new representation.
   - Old clients continue to read and write the old representation.
   - The API boundary maps both representations to the single canonical field.
   - If a request supplies both names with different values, reject it rather than choosing silently.

4. Use the repository’s existing API versioning or content-negotiation mechanism to select the old or new response representation. Do not add a new versioning mechanism without evidence that one is missing.

5. Mark the old representation deprecated and measure old-field traffic. After 90 days and once old-client traffic reaches zero, remove the adapter, old documentation, and compatibility tests.

If deployments are rolling rather than atomic, use the migration mechanism’s expand/contract pattern: temporarily make the schema and application tolerate both column names, backfill and verify the new column, switch reads and writes to it, then remove the old column after the compatibility period. That temporary database compatibility path should have the same explicit removal date.

Independent proof should cover stored-data preservation, old and new API representations, conflicting input, rollback/recovery, and the removal criteria. The repository does not specify the actual field names, schema technology, or API negotiation mechanism, so those details must be established before turning this into a concrete patch.
