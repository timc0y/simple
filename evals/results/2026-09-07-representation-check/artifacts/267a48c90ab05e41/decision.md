# Decision

Keep one logical enrollment key, represented by both physical columns for the
fixed 90-day overlap. Keep `legacy_enrollment_key` as the canonical storage
value because it already contains the authoritative data, and make a database
trigger the owner of synchronization. The trigger runs in the writer's
transaction, so a committed row always has equal values in both columns.

## Design

1. Add `scanner_key` and backfill it from `legacy_enrollment_key` before
   exposing the new writer. Verify that the backfill copied every existing
   value.
2. Install a `BEFORE INSERT OR UPDATE` trigger on `enrollments`.
   - On insert, accept a value supplied through either column. If both are
     supplied, require equality. Fill the other column with the chosen value.
   - On update, identify which physical column changed relative to `OLD`.
     Propagate a change in one column to the other. If both changed, require
     equality; otherwise reject the statement.
   - Compare values with PostgreSQL's null-safe equality rules. Preserve the
     existing key's nullability and null/uniqueness semantics; if the current
     contract requires a non-null key, enforce that at the same boundary for
     both columns.
   - Raise a constraint error for a conflict. Do not choose one value silently.
3. Keep equivalent unique constraints or indexes on both physical columns so
   either consumer's exact `INSERT ... ON CONFLICT (column)` target remains
   valid. The trigger populates both columns before PostgreSQL checks
   uniqueness, so a duplicate is rejected regardless of which consumer wrote
   it. Existing rows must be checked before creating the second unique
   constraint.
4. Route Access Ledger application writes through the same logical-key
   operation, but retain the trigger as the database boundary for direct SQL
   from the appliance and scanner. The application path must not be the only
   synchronization mechanism.

The resulting path is:

```text
consumer writes one or both physical columns
  -> BEFORE trigger selects or rejects the logical value
  -> trigger sets both columns
  -> unique constraints validate the synchronized row
  -> one transaction commits both representations
```

An `UPDATE` or an `INSERT ... ON CONFLICT DO UPDATE` follows the same trigger
path. A concurrent write is handled by PostgreSQL's normal row and unique-index
locking; it either commits a synchronized value or fails with a conflict or
uniqueness error. There is no asynchronous repair window.

## Retirement

The dual-column design is bounded to the 90-day overlap. At retirement, first
verify that the version-4 appliance has stopped issuing reads and writes and
that no other supported consumer still names `legacy_enrollment_key`. In a
separate migration, keep `scanner_key` as the remaining representation,
verify all rows and uniqueness behaviour, then remove the legacy unique
constraint, trigger branches, and column together with the application code
that still depends on them. The retirement migration needs its own backup,
verification, and rollback procedure; it is not part of the overlap release.

## Focused verification

Use a PostgreSQL integration test with the real table, constraints, trigger,
and both SQL shapes:

- Seed existing legacy rows, run the backfill, and verify both columns match.
- Insert through `legacy_enrollment_key` only and through `scanner_key` only;
  read both columns in a new read-committed transaction.
- Insert with both columns equal; insert with different values and verify the
  latter rolls back without changing the row.
- Update each column independently, update both equally, and update both with
  different values. Verify the same acceptance and rejection rules.
- Exercise `INSERT ... ON CONFLICT` against each exact column name, including
  its update branch, and verify both representations after commit.
- Attempt duplicates through each column and verify the existing uniqueness
  contract is preserved.
- Run concurrent writes against one row and verify every committed state has
  equal values; a failed transaction must not leave a half-updated row.
- After a transaction commits, read through both consumer-shaped SQL queries
  under read-committed isolation and verify the new value is visible.

The check must inspect the stored row and constraint outcomes independently of
the trigger function's internal calls. A trigger unit test alone would not
prove direct consumer compatibility or `ON CONFLICT` behaviour.

## Unnecessary work

The overlap does not need a view, a second synchronization service, an
asynchronous repair queue, polling, distributed locks, or application-only
dual writes. It also does not need a new public versioned protocol: both
consumers already require their fixed physical column names. Maintaining a
separate logical-key table would divide ownership without solving the direct
write contract.
