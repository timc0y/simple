Implement one canonical new field, with bounded compatibility at the existing persistence/API boundaries.

1. Add a migration using the service’s existing mechanism to rename the stored field to the new name. Preserve every value and make the migration reversible for rollback.

2. Update the domain model and internal code to use only the new field name.

3. At the API boundary, accept both request keys:

   - new key → canonical field
   - deprecated old key → canonical field

   If both are supplied, reject conflicting values deterministically.

4. During the 90-day deprecation period, return both API keys with the same value. Mark the old key deprecated and emit usage telemetry.

5. Test:

   - migration preserves all stored records;
   - new clients read and write the new representation;
   - old clients continue to read and write the old representation;
   - mixed old/new requests behave consistently;
   - rollback restores the old schema and behavior.

After 90 days, remove the old API alias only when old-client traffic is zero, then remove its compatibility code and any migration-only support. If deployments run old and new binaries concurrently, use the existing migration mechanism’s expand/backfill/contract pattern instead of an in-place rename.
