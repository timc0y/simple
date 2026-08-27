Rename the stored field through the existing migration mechanism, making the new name the single source of truth. Migrate every retained customer record and provide a reversible down migration.

Keep one bounded API compatibility adapter for 90 days:

- New clients use `newField`, mapped directly to the renamed stored field.
- Old clients use `oldField`; the adapter translates requests to the canonical field and translates responses back to `oldField`.
- Do not dual-write or retain two persisted fields.

The API needs an established way to distinguish old from new clients (for example, its existing API-version route or media type). If none exists, that is the material missing design fact; adding an unversioned response containing both names would create an ambiguous public contract.

Prove the change by verifying migrated customer data, old and new API reads and writes, migration rollback, and that the old representation is removed only after the 90-day promise has ended and old-client traffic is zero.
