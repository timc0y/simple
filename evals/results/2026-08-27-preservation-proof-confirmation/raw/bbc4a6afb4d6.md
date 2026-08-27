Rename the stored field once through the existing migration path, and keep compatibility only at the API boundary for 90 days.

1. Add a migration that renames/backfills the persisted field and preserves every customer value. The application reads and writes only the new stored field after this migration—no dual writes.

2. Make the API boundary translate the legacy field name to the new canonical field on requests. If both names are supplied with different values, reject the request as ambiguous.

3. During the deprecation period, expose both API field names from the same canonical value, marking the old name deprecated. This lets published old and new clients operate without a second storage model.

4. Prove the change by checking migrated records, old and new request/response shapes, rollback of the migration, and that legacy-field traffic is zero when the 90 days end.

5. At the agreed exit condition—90 days elapsed and no old-client traffic—remove the legacy API mapping and field, then verify the new representation remains the only public contract.

The exact legacy and replacement field names, and the API’s existing deprecation annotation mechanism, are not provided; those must be established before implementation.
