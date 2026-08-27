Implement this as one bounded compatibility change.

### Outcome

The new persisted field and API name become canonical. Existing clients continue working for 90 days, while customer data remains intact.

### Implementation

1. Add a reversible schema migration using the existing migration mechanism to rename the stored field. Preserve values exactly; do not introduce a second stored source of truth.

2. Update the model and all repository code to use the new persisted name.

3. Configure `CustomerSerializer`’s existing deprecation alias:
   - accept both old and new request names;
   - reject requests containing conflicting values;
   - serialize the single internal value under both names.

4. Add tests for:
   - reading existing records after migration;
   - writing with either API name;
   - rejecting conflicting names;
   - returning both names with identical values;
   - migration rollback and data preservation.

5. Monitor old-field API traffic during the 90-day period. Once it reaches zero and the period ends, remove the alias, stop emitting the old name, and remove related tests and documentation.

The remaining deployment constraint is rollback compatibility: if an older application version must run against the renamed schema, verify that the migration mechanism or release sequence supports that explicitly. If it does not, use a temporary expand/backfill/cutover migration before removing the old column.
