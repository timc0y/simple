Make the new field the canonical persisted value, with the old field as a temporary compatibility projection.

1. Add the new nullable column through the existing migration mechanism. Backfill it from the old column; reads use `new ?? old` until backfill is verified.

2. At the persistence boundary, atomically write both columns during the 90-day transition. Validate any request that supplies both names: reject conflicting values. This preserves rollback and prevents the two columns silently diverging.

3. At the public API boundary, translate only by the existing client/version selection:
   - old clients receive and may send the old field name;
   - new clients receive and may send the new field name;
   - application code uses only the new name.

4. Prove the migration with retained records, old and new API requests and responses, updates through either representation, and rollback to the prior release.

5. When the 90 days have elapsed and old-client traffic is zero, remove the old API mapping, stop the dual write, then remove the old column in a later migration.

The unresolved detail is how clients are distinguished. Reuse the published API’s existing version or representation mechanism; do not add a second routing scheme solely for this rename.
