Rename the stored column through the existing migration mechanism, preserving its values. Make the new name the service’s only internal field and write target.

For the 90-day API transition, keep one boundary adapter:

- Accept either the old or new request field; reject requests that provide both with different values.
- Return both field names with the same value, so old and new published clients continue to work.
- Do not dual-write or retain a second stored column.

Make the migration reversible so rollback restores the original column name and data. Verify migrated customer records, requests and responses using each API name, rollback, and that old-client traffic is zero before removing the old API field at the end of the deprecation period.
