Implement the rename as a bounded expand-and-contract migration.

1. Add the new persisted field using the existing migration mechanism. Keep the old field temporarily.

2. Backfill the new field from the old field and verify row counts, nulls, and representative customer records.

3. Make the new field canonical inside the service. At the API boundary:

   - Accept both old and new request keys.
   - Normalize either key to the new internal field.
   - Reject requests containing conflicting values.
   - Return the old key to old clients and the new key to new clients using the existing API versioning or content-negotiation mechanism.
   - Do not expose both keys indefinitely.

4. During the 90-day deprecation period, write the canonical value to the new field and maintain the old field only as a rollback-compatible mirror. Monitor old-key requests and old-client traffic.

5. Verify:

   - Existing records retain their values.
   - Old clients receive the old representation.
   - New clients receive the new representation.
   - Writes through either representation round-trip correctly.
   - Rollback to the previous service version still works.

6. After 90 days, remove the old-client adapter only when old-client traffic is zero or explicitly waived. Then remove the mirror writes, old persisted field, backfill compatibility, and deprecation documentation in a follow-up migration.

The new field is the sole service-level source of truth; the old field and API mapping exist only for the explicitly bounded compatibility window.
