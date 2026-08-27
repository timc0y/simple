Use one canonical new field and a bounded compatibility adapter for the 90-day promise.

1. Add the new persisted column through the existing migration mechanism and backfill it from the old column. Make the migration reversible and verify row counts and values.

2. Update the service’s single persistence boundary to use the new field. During the transition, preserve the old column only if production rollback requires an older service binary to run; in that case, write both fields atomically and treat the new field as canonical. Otherwise, do not add dual writes.

3. At the API boundary, use the existing representation/version selection to translate:
   - old requests/responses use the old public field name;
   - new requests/responses use the new name;
   - both map to the same canonical service field.

   If there is no existing way to select an old versus new representation, that is the missing fact to establish before choosing whether the endpoint can emit both names or needs a versioned route/media type.

4. Test stored-data backfill, old and new API representations, validation conflicts if both names are supplied, migration rollback, and that no data is lost.

5. At 90 days, once old-client traffic is zero, remove the old API adapter and old persisted column in a final migration; remove its tests and deprecation documentation at the same time.

This keeps compatibility in one owned boundary, avoids a permanent second model, and gives the transition a clear removal condition.
