The smallest implementation is one canonical field with a bounded API compatibility adapter.

1. Add a schema migration using the existing migration mechanism that renames the persisted field in place. Do not create a second stored field or dual-write path.

2. Update the domain model and internal code to use only the new field name.

3. At the API boundary for the 90-day transition:

   - Accept both old and new request names.
   - Normalize either input to the new internal field.
   - Reject requests containing both names unless their values match.
   - Return the new name and the deprecated old name mapped from the same value, so old clients continue working.
   - Mark the old API name deprecated in the published schema and documentation.

4. Add tests covering:

   - Migration preserves every stored value.
   - New requests and responses use the new name.
   - Old requests and clients continue to work.
   - Both names produce identical values.
   - Conflicting names are rejected deterministically.
   - Migration rollback restores the old persisted name without data loss.
   - The old adapter is removed only after 90 days and zero old-client traffic.

The persisted schema should have one source of truth; compatibility belongs at the API boundary. After the deprecation period, remove old-name parsing, old-name serialization, documentation, and telemetry. The repository contains no implementation files, so exact file or migration names cannot be identified from the available case.
