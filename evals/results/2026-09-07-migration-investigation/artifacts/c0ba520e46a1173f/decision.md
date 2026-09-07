# Migration decision

Use a direct SQLite column rename for Deployment A. Use a temporary additive
compatibility column for Deployment B, then remove it after the old worker has
stopped. The HTTP contract remains `item_title` in both deployments; only the
internal database name changes to `label`.

## What must survive

- Every existing inventory row and its title value.
- The published HTTP response field `item_title`.
- Deployment B's old worker, which reads `item_title`, for the stated 48 hours.
- A recoverable pre-migration database state.

There is no external SQLite consumer, so SQLite itself is not a published
interface. Deployment B is the exception: the old worker is a real temporary
consumer and makes the old column name a compatibility obligation during that
window.

## Deployment A

Stop the process, take a backup, and perform one schema/application release:

1. Rename `inventory.item_title` to `inventory.label` with SQLite's native
   column-rename operation.
2. Change internal queries and writes to use `label`.
3. Map `label` to `item_title` at the HTTP response boundary.

This is the smallest migration because the process is stopped and no old
consumer needs the old schema. The rename preserves the column's existing
values and avoids a second source of truth.

Verify before reopening the process:

- The table has `label` and no longer has `item_title`.
- Row count and a sample or checksum of title values match the backup.
- Internal reads and writes use `label`.
- An HTTP response still contains `item_title` with the expected value.
- The application starts and its migration checks pass against a copy of the
  backup as well as the live migrated database.

If verification fails, stop the upgraded process and restore the backup. Do not
run the migration again against an uncertain database. Recovery is the backup
plus the previous application build; the backup must remain untouched until
the migrated database has passed verification.

## Deployment B

Keep both workers operational by adding, rather than renaming, the new column:

1. Add nullable `inventory.label` while both builds can still run.
2. Backfill `label` from `item_title` in a transaction, preserving all existing
   rows.
3. Deploy the new build with internal reads and writes using `label`, while its
   write path also updates `item_title` for the 48-hour compatibility window.
4. Keep the HTTP mapping from `label` to `item_title`.
5. After the old worker is stopped and the 48-hour window has ended, take a
   fresh backup and remove the compatibility column in a separate maintenance
   change. If the supported SQLite version cannot safely drop the column, use
   SQLite's documented table-rebuild procedure, copying every column and row.

During the window, `item_title` is a compatibility projection, not a second
business value. The new build owns the write operation and must update both
columns in the same transaction. If the old worker can also write rows (the
context only says that it queries), that fact changes the plan: add narrowly
scoped SQLite synchronization triggers for writes from either column, or pause
the old writer. Do not claim consistency from a read-only backfill when old
code can mutate `item_title` directly.

Verify Deployment B in stages:

- After backfill, row count and title values match between the two columns.
- The old worker can still read `item_title` while the new build reads `label`.
- A new or changed title is visible through both worker paths and through the
  HTTP `item_title` response.
- A failed dual-column write rolls back as one transaction; no partial update
  is accepted.
- After the old worker exits, confirm that no old process or query remains,
  back up the database, remove `item_title`, and repeat the row/value and API
  checks against the rebuilt schema.

If the additive migration or dual-write release fails, leave `item_title` in
place, stop or roll back the new build, and restore the pre-addition backup only
after checking whether the failed transaction committed. If a write may have
started but its result is uncertain, reconcile the row before retrying; do not
blindly repeat it. During the 48-hour window, the safe rollback target is the
old build with the schema containing `item_title`. After cleanup, recovery is
the cleanup backup plus the new build; keep that backup until the next verified
backup exists.

## Why the decisions differ

Deployment A has no concurrent old caller, so renaming the existing column
solves the requirement in one owner and one source of truth. Deployment B has a
real, time-bounded old caller, so renaming immediately would break it. Adding
`label` supplies the new build's precondition while retaining the old address,
and dual-writing preserves the old reader until its explicit retirement point.
The compatibility column and any synchronization machinery should be removed
once that point is proven; they are not a permanent API or schema promise.
