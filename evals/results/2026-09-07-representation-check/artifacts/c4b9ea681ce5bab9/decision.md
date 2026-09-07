# Enrollment key overlap decision

Use the database as the synchronization owner for the fixed 90-day overlap. Keep
`legacy_enrollment_key` as the canonical representation because it is the existing
authoritative column, and keep `scanner_key` as a compatibility representation of
the same logical value. The application write path should write the canonical value;
the database trigger must also support direct writes from either consumer.

## Ownership and write path

Add `scanner_key`, backfill it from `legacy_enrollment_key`, and add a unique
constraint or unique index for it. Keep the existing uniqueness enforcement on
`legacy_enrollment_key`. The database row-level trigger is the only synchronizer:
it runs before both `INSERT` and `UPDATE`, so the synchronization and uniqueness
checks happen in the writer's transaction.

For an insert:

- If both values are supplied and differ, reject the row.
- If only one is supplied, use that value for both columns.
- If both are supplied and equal, keep that value in both columns.

For an update, compare each incoming value with its old value using null-safe
comparison:

- If only `legacy_enrollment_key` changed, copy it to `scanner_key`.
- If only `scanner_key` changed, copy it to `legacy_enrollment_key`.
- If both changed to the same value, accept it.
- If both changed to different values, reject the statement.
- If neither changed, leave the row unchanged.

This lets either consumer issue its existing direct `UPDATE` or
`INSERT ... ON CONFLICT` against its exact column. The trigger normalizes the row
before the statement completes; the unique indexes then apply to the same value.
An accepted commit therefore makes both representations readable immediately under
normal read-committed isolation. A rejected conflict rolls back the whole writer
transaction.

Do not rely on a view, read-time fallback, background repair, or application-only
coordination. Those do not satisfy direct writes and would permit a consistency
window. Do not add a second synchronization service or a new logical table: neither
adds a present requirement beyond the trigger and existing `enrollments` row.

## Conflicts and uniqueness

The trigger must raise a constraint-style error for unequal simultaneous values;
it must not choose one value silently. The existing legacy uniqueness behavior is
preserved, and the scanner representation receives equivalent uniqueness
enforcement so scanner-side conflict handling has a valid arbiter. Existing rows
must be checked before the unique scanner constraint is created; the backfill
should abort rather than invent a resolution if the source data is inconsistent.

Concurrent writes remain subject to PostgreSQL row locking and unique-index
enforcement. A transaction that loses a uniqueness race fails normally and leaves
no partially synchronized row. Verification should also exercise the actual
consumer-shaped statements, including both-column conflicts, one-column updates,
inserts, upserts, duplicate keys, null behavior if the existing schema permits
nulls, rollback, and concurrent conflicting writes. Read both columns from a new
read-committed transaction after each successful commit and assert equality.

## Retirement

The overlap design ends with the appliance retirement; it is not a permanent
dual-write contract. In a separate, planned migration, first confirm that no
appliance or legacy SQL remains, then make `scanner_key` the sole canonical
column, verify/backfill it if needed, remove the legacy-specific trigger behavior
and unique constraint, and finally drop `legacy_enrollment_key`. Deploy that
migration separately so rollback and ownership are clear. Until that evidence and
migration exist, retain both physical columns and the trigger.

The genuinely unnecessary work is any asynchronous synchronizer, compatibility
view, consumer protocol change, duplicate service, or premature removal of the
legacy column. The only required overlap state is the two columns, their matching
uniqueness rules, and one transactional database synchronization path.
