# Decision

Use `returnReason` only inside the application domain. Keep `reason_code` at both
existing representation boundaries:

`HTTP reason_code` ↔ `returnReason` ↔ `PostgreSQL reason_code`

This is safe during a rolling deploy because old instances and new instances use
the same JSON field and the same nullable database column. Neither the API contract
nor the stored representation changes.

## Plan

1. Rename the domain property from `reasonCode` to `returnReason` in the application
   types and domain logic.
2. In the existing HTTP adapter, continue deserializing request `reason_code` into
   `returnReason` and serializing `returnReason` as response `reason_code`. Preserve
   the current nullable and absent-value behaviour.
3. In the existing repository, continue selecting and writing
   `returns.reason_code`, mapping that column to and from the domain property
   `returnReason`. Do not rename the column or change its meaning.
4. Deploy the application change without a database migration. During overlap, old
   instances continue using `reasonCode` in their own code and new instances use
   `returnReason`, but both read and write the same unchanged column and API field.

## Compatibility work omitted

- No API version, deprecation window, or client migration: clients must continue to
  send and receive `reason_code`.
- No database rename, second column, dual write, backfill, or data migration: the
  reporting job reads `returns.reason_code` directly, and existing data remains the
  source of truth.
- No reporting-job or SQL change: it is outside this team’s ownership and its
  contract remains intact.
- No feature flag or shadow path: the boundary mappings are sufficient for the
  stated rolling-deploy overlap.

## Checks

- Type and unit checks prove that domain values named `returnReason` map to
  `reason_code` on both HTTP input and output, including `null` and the current
  absent-value cases.
- Repository tests prove that existing rows with `reason_code` hydrate as
  `returnReason` and that writes still target only `returns.reason_code`, preserving
  nullability.
- A rolling-compatibility test runs old and new application versions against the
  same database: old-written data is new-readable, new-written data is old-readable,
  and both versions continue to satisfy the `reason_code` JSON contract.
- A database check confirms that the column name, type, nullability, and existing
  values are unchanged; no migration or backfill is run.
- An end-to-end check reads a value through `GET /v1/returns/:id` and verifies that
  the reporting job’s direct `returns.reason_code` read still returns the same value.

If any check requires changing the column or supporting a second external name, the
assumption that this is an internal representation rename is false and the plan must
be reconsidered before release.
