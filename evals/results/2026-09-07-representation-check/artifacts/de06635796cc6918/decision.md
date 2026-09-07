# Decision

Keep both physical columns for the fixed 90-day overlap. Treat the enrollment
key as one logical value, with `legacy_enrollment_key` remaining the canonical
stored representation during the overlap. A row-level PostgreSQL trigger owned
by Access Ledger synchronizes the other column inside the transaction that
writes either column.

This preserves both fixed SQL contracts without introducing a view, an
asynchronous repair worker, or a second application owner.

## Ownership and write path

Access Ledger owns the invariant and the database schema. The trigger is the
single enforcement point, so the appliance, scanner, and application write
paths do not need to know about one another.

Before enabling scanner writes:

1. Add nullable `scanner_key`.
2. Backfill it from the authoritative `legacy_enrollment_key` values.
3. Validate that every row has the expected representation and that the
   existing enrollment-key uniqueness constraint remains valid.
4. Install the trigger before exposing the column to the scanner.

The trigger runs `BEFORE INSERT OR UPDATE` for either key column:

- On an insert, copy the supplied value to the other column. If both values
  are supplied and differ, reject the statement.
- On an update, detect which representation changed. If only the legacy value
  changed, copy it to `scanner_key`; if only the scanner value changed, copy it
  to `legacy_enrollment_key`.
- If both values changed, accept them only when they are equal. A mismatch is a
  conflict and the statement fails without changing the row.
- If neither value changed, leave the row unchanged. An invariant check should
  reject any pre-existing unequal pair rather than silently choosing a value.

Equality must use PostgreSQL's null-safe comparison. The migration must retain
the existing nullability and uniqueness semantics; if the existing enrollment
key is required, enforce that requirement for both representations as part of
the schema change. If null is a valid existing value, the trigger must define
one null logical value and the verification must cover it rather than changing
that contract.

The existing unique constraint remains on the canonical `legacy_enrollment_key`
during the overlap. Since the trigger updates that column before PostgreSQL
checks constraints, inserts and updates issued against `scanner_key` receive
the same uniqueness behavior as legacy writes. A duplicate raises the normal
constraint error and the whole statement, and therefore its transaction's
write, rolls back. Concurrent writes to one row are serialized by PostgreSQL's
normal row locking; each committed row has equal values, and a subsequent
read-committed read through either column observes that committed pair.

The application write path should use the canonical value where it already
does so, but it must not become a second synchronization owner. Direct writes
from either external consumer are valid and are covered by the database rule.

## Retirement

Do not remove `legacy_enrollment_key` at the end of the overlap as part of this
release. First confirm that the appliance is retired and that no other direct
legacy consumer remains. In a separate migration:

1. Make `scanner_key` the application canonical column and verify all rows.
2. Move the unique constraint to `scanner_key` without permitting duplicates.
3. Remove the synchronization trigger after all writers use `scanner_key`.
4. Drop `legacy_enrollment_key` only after the old contract and rollback window
   have ended.

If the legacy column is retained for rollback or audit, it remains a checked
compatibility field rather than an additional source of truth. Its removal is
not required to satisfy the 90-day overlap.

## Focused verification

Verify through SQL paths that represent the real consumers:

- Backfill preserves every existing legacy value and produces equal pairs.
- Insert through each column, then read both columns in a new read-committed
  transaction.
- Update through each column and verify the other representation changes in
  the same transaction.
- Write both columns with equal values successfully; write unequal values and
  verify rejection plus no partial update.
- Attempt duplicate inserts and updates through both column names and verify
  the existing uniqueness behavior and atomic rollback.
- Exercise concurrent writes to the same row and confirm every committed
  result has equal values, with no asynchronous repair step.
- Verify the appliance's legacy SQL and the scanner's fixed SQL, including
  `INSERT ... ON CONFLICT`, continue to address physical columns rather than a
  view or alias.
- After retirement in a separate test migration, verify scanner writes,
  uniqueness, and the absence of legacy references before dropping the old
  column.

## Unnecessary work

The 90-day requirement does not justify a compatibility view, an event queue,
a repair job, application-level dual-write protocols, feature flags, a second
canonical store, or a permanent dual-column design. Those add owners or delay
consistency while the database trigger already has the required transaction
boundary. A legacy-column removal migration belongs after appliance retirement,
not in the overlap release.
