Use a bounded compatibility migration:

1. Add the renamed persisted column through the existing schema migration mechanism; retain the old column.
2. Backfill the new column from the old one and verify every retained customer record.
3. Make the service’s internal model use the new field name. During the 90-day window:
   - accept the old public field on the existing API surface;
   - expose the new field only through the API’s established new/alternate representation;
   - translate both forms at the API boundary;
   - write both database columns so rollback and old service instances remain safe.
4. Read the new column as canonical, with a temporary fallback to the old column only for incomplete migration recovery.
5. Prove the change with tests for:
   - old and new API representations;
   - migrated stored records and subsequent writes;
   - rollback to the prior application version;
   - rejection/removal criteria after 90 days.

After the promise expires and old-client traffic is zero, remove the old API representation, fallback, dual write, and old column in a final migration.

Do not rename the existing API field in place or immediately rename/drop the database column: both would break published clients or make rollback unsafe.
