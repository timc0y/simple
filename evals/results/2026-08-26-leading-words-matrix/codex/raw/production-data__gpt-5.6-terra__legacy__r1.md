Use one bounded compatibility adapter around a canonical new field.

1. Add the new persisted column using the existing migration mechanism; keep the old column intact. Backfill the new column from the old one, with a verification query that finds no missing or mismatched values.

2. Make application code use the new field internally. During the rollback window, mirror writes to the old column so a rollback can still read current records. If a request supplies both API names with different values, reject it rather than choosing silently.

3. At the public API boundary, accept both the old and new request fields and normalize them to the new internal field. Return both representations during the 90-day promise:
   - old field: deprecated, retained for published clients;
   - new field: preferred representation.

   This is the single compatibility adapter; persistence and business logic should not retain two concepts.

4. Mark the old API field deprecated in the published schema/docs, including its removal date. Instrument old-field requests/responses so removal is evidence-based.

5. After 90 days, and once old-client traffic is zero, remove the old API field, old-column mirroring, and then the old column in a later migration.

Proof should cover migrated stored records, old-only and new-only API requests, responses containing each representation, conflicting dual-field requests, rollback after writes, and removal criteria. The only unresolved implementation detail is the service’s existing API-version/deprecation mechanism; use it if it already provides representation selection, otherwise the temporary dual-field response is the smallest way for old and new clients to coexist on one endpoint.
