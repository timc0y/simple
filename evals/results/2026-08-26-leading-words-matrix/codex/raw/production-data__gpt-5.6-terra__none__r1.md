Implement this as an expand–migrate–contract change, preserving the old API field for 90 days.

- Add the renamed database column through the existing migration mechanism; keep the old column intact initially.
- Backfill the new column from the old one, then keep both synchronized during the transition (application dual-write, with a defined precedence/error on conflicting values).
- Make the new API field canonical for new clients. Continue accepting and returning the old field as deprecated so published clients keep working.
- If both API names are supplied on write, reject mismatched values; accept matching values.
- Read from the new stored field, falling back to the old field until backfill/synchronization is verified.
- Mark the old public field deprecated in API documentation/client generation and communicate its 90-day removal date.
- Verify: existing retained records migrate correctly; old and new request/response representations work; deployments can roll back without data loss; monitoring shows old-field/client traffic.
- After 90 days, and only once old-client traffic is zero, remove old-field API support, stop dual-write, and run a final migration to drop the old column.

This protects both customer data and the published contract while giving new integrations a clean canonical name.
