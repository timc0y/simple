Use an expand–migrate–contract change; do not rename the database column in place.

1. Add the new persisted field through the existing migration mechanism, keeping the old field intact.
2. Backfill the new field from the old one, with validation and resumable/idempotent batches.
3. Deploy application code that treats the new field as canonical but reads both fields and writes both during the transition (in one transaction). Define a deterministic fallback for records not yet backfilled.
4. Preserve the old API representation for existing clients for 90 days, and expose the renamed field in the new representation. If a request can send either name, accept both; reject requests that send conflicting values.
5. Instrument use of the deprecated API field/representation and send the normal deprecation notice.
6. Verify:
   - existing stored records retain their value after backfill;
   - old clients receive and can update the old representation;
   - new clients receive and can update the new representation;
   - mixed-version writes stay consistent;
   - rolling the application back remains safe while both columns exist.
7. After 90 days, only when old-client traffic is zero, remove the old API representation, stop dual writes, and later remove the old persisted field in a separate migration.

The key design choice is temporary duplication, not a physical rename: retained customer data and published clients make an in-place rename unnecessarily risky.
