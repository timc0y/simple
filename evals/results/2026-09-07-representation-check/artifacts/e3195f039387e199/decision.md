# Migration decision

Use one stored value and translate names at the boundaries. The published HTTP
field remains `item_title`; application code uses `label`.

## Deployment A

Because the process is stopped while the schema and application change happen
together, rename the SQLite column from `item_title` to `label` in the database
migration. Update the existing data-access code to read and write `label`, and
map `label` to the published HTTP field `item_title` in the existing serializer.
Do not add a second column or dual writes.

Take the available backup immediately before the migration. If the migration or
application upgrade fails, stop the process and restore that backup, then run
the previous application build. If the upgrade succeeds but verification finds
a defect, use the same restore-and-rollback procedure; do not assume that an
application rollback alone can use the renamed schema.

Verify, before declaring the deployment complete:

- the row count and every existing value are unchanged after the rename;
- the new application can create, read, and update an item through its normal
  data-access path using `label`;
- the HTTP response still contains `item_title` with the expected value; and
- the previous build can start against the restored backup if recovery is
  required.

## Deployment B

For the 48-hour overlap, do not rename or remove the SQLite `item_title` column.
Keep it as the single stored value. Change the new build's data-access boundary
so its internal record is called `label`, while that boundary reads and writes
SQLite `item_title`. Keep the existing HTTP serializer mapping `label` back to
`item_title`.

This is sufficient because the older worker queries the existing column
directly, and no other process needs a new database representation. Adding a
`label` column, backfilling it, and dual-writing would create synchronization and
rollback obligations without helping either known consumer.

During the 48 hours, verify both builds against the same database: the old
worker's query continues to return the expected values, and the new build's
create/read/update path and HTTP response use `label` internally while exposing
`item_title`. Check that values written by either build are visible to the other
where their shared operation requires it.

After the older worker is retired and no longer queries the database, perform a
separate Deployment A-style migration: back up the database, rename the column
to `label`, retain the HTTP mapping, verify retained values and the API, and
restore the backup plus the previous build if verification fails. Until that
exit condition is confirmed, `item_title` is the compatibility path and must
not be removed.

## What must survive

- Every existing row and its `item_title` value.
- The published HTTP response field `item_title` and its meaning.
- The old worker's ability to query `item_title` throughout its 48-hour support
  window.
- A recoverable pre-change database backup and a tested rollback procedure.

The deployments differ only because Deployment B has a concurrent, unchangeable
reader of the stored name. No new service, framework, watcher, PR queue, or
permanent second source of truth is needed.
