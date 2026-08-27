Use the existing schema migration to rename the stored field from `oldField` to `newField`, with a reversible down migration. Make `newField` the sole internal and persisted name.

At the API boundary, keep one temporary legacy adapter for the 90-day commitment:

1. New API representation reads and writes `newField`.
2. Legacy API representation translates `oldField` to/from the same internal `newField`.
3. Do not retain two persisted fields or add dual writes; one stored value remains authoritative.
4. Publish the new API contract and mark `oldField` deprecated, with the removal date.

Deploy the schema migration and application change together. Roll back by first applying the reverse schema migration, then restoring the prior application version; verify the migration preserves every value in both directions.

Prove the change with tests or staging checks that:

- migrate existing customer records and confirm values under `newField`;
- exercise both old and new API representations against the same record;
- reject or explicitly define requests that send both names;
- roll forward and back without data loss;
- confirm removal is allowed only after 90 days and legacy-client traffic is zero.

One fact remains necessary before implementation: identify how requests select the legacy versus new representation (existing API version, endpoint, or negotiated schema). If no such discriminator exists, define one; returning both field names everywhere would create a second public contract rather than a bounded adapter.
