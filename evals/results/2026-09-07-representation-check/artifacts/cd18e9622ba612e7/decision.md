# Decision

Keep both physical columns for the fixed 90-day overlap and make the database the
single synchronization owner. `legacy_enrollment_key` remains the canonical value
during the overlap because it already contains the authoritative data. The
application writes that value through its normal database path; the trigger covers
the two consumers that bypass the application and write SQL directly.

## Representation and write rules

Add `scanner_key` as a nullable column, then install one `BEFORE INSERT OR UPDATE`
trigger on `enrollments`. The trigger enforces that the two columns represent one
logical value:

- On insert, copy the non-null value to the other column when only one value is
  supplied. Accept both values when equal. Reject the statement when both are
  supplied and differ.
- On update, compare each new value with its old value. If only one representation
  changed, copy that value to the other column. If both changed, accept equal values
  and reject differing values. If neither changed, leave both alone.
- Preserve the table's existing nullability and null meaning. If an enrollment key
  is required today, retain that requirement; do not use this migration to invent a
  new one.

The trigger is the owning boundary, not an asynchronous repair job. PostgreSQL runs
it before constraints and commits the row change atomically. A conflict raises a
validation error and rolls back the whole statement/transaction. A successful write
therefore commits equal values in both columns, and the other consumer's next
read-committed read sees the synchronized row. Concurrent updates are serialized by
the row lock; the trigger evaluates the current `OLD` row for the update that wins.

Keep the existing unique constraint for the legacy representation and add equivalent
uniqueness for `scanner_key` after it has been populated. Both indexes must cover the
same logical key. This preserves existing uniqueness and lets each consumer's
`INSERT ... ON CONFLICT` name its own exact physical column. A duplicate key still
fails or follows that consumer's existing upsert action; it must not create a second
row or a divergence. Confirm the current constraint's null behavior and conflict
target during implementation rather than changing it implicitly.

## Safe rollout

1. Add `scanner_key` and the trigger in one schema change so no committed row can
   enter the overlap with only one representation. Keep the existing legacy column,
   constraint, and application write path.
2. Backfill `scanner_key` from `legacy_enrollment_key` for existing rows. The trigger
   remains enabled while the backfill runs, so writes racing with the backfill still
   use the same rule.
3. Verify that every row has equal representations and that no legacy uniqueness
   violation exists, then build the scanner uniqueness index/constraint using the
   least-blocking PostgreSQL migration supported by the deployment. Do not start
   consumer traffic that targets `scanner_key` until that uniqueness is valid.
4. Exercise both direct SQL write paths and the application path before declaring
   the overlap ready. A failed conflicting write must leave the row and transaction
   unchanged.

This preserves the exact column names, requires no consumer change, and has no
asynchronous repair window. A brief schema lock while adding the column and trigger
must be scheduled within the normal deployment mechanism; it must not become a
consumer outage.

## After the appliance retires

Do not remove the legacy representation as part of this overlap release. In a
separate migration, first prove that the appliance and any other legacy SQL callers
are retired and that retained data no longer requires the column. Make
`scanner_key` the canonical application value, verify its unique constraint and
back up/verify retained enrollment data, then remove the legacy-specific write path,
the synchronization trigger, the legacy uniqueness constraint, and finally
`legacy_enrollment_key`. The retirement migration is a separate rollback and
recovery decision; until it is approved, keeping the trigger and both columns is the
safe state.

## Focused verification

Verify the invariant and the actual contracts, not just the trigger function:

- Existing rows retain their legacy values and gain equal scanner values after the
  backfill.
- Insert with legacy only, scanner only, both equal, both different, and neither
  follows the documented rules.
- Update either column alone, update both to equal values, and update both to
  different values. The last case fails and leaves both old values intact.
- Each consumer's exact insert/upsert and update works through its physical column,
  including duplicate-key handling, while uniqueness remains enforced.
- The application write path reaches the same invariant, and a committed change is
  visible to the other consumer under read-committed isolation.
- Concurrent writes to the same row cannot commit unequal representations; failed
  transactions do not leave partial changes.
- Before retirement, query for unequal/non-null mismatches and unexpected nulls and
  record the result as the removal precondition.

## Unnecessary work

No view, alias, service-side dual-write worker, polling repairer, second table,
message queue, feature flag, consumer protocol change, or new permanent API is
needed. The two physical columns are required only because both fixed consumers
write them directly. Renaming either column during the 90-day window and adding a
general synchronization abstraction would preserve no additional contract.
