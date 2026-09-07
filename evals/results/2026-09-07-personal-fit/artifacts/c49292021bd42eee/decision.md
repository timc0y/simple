# Migration decision

## Deployment A

Use a backup-and-cutover migration while the single process is stopped:

1. Take and validate a backup of the SQLite database.
2. Rename the `item_title` column to `label` in a transaction (using the
   SQLite version's supported `ALTER TABLE ... RENAME COLUMN` operation).
3. Upgrade the application so its persistence code uses `label` and its HTTP
   response mapper still emits the public field `item_title`.
4. Start the process and run the smoke checks before accepting traffic.

This is the smallest migration because no old process needs the old column
while the database is being changed. Existing rows remain in the renamed
column; the API compatibility is handled at the application boundary rather
than by retaining a second stored value.

What must survive:

- every row and its `item_title` value, now stored as `label`;
- primary keys, indexes, constraints, and other table metadata;
- the public HTTP response shape, including the name `item_title`.

Verify by checking row counts and null/value totals against the backup,
inspecting the resulting schema and indexes, exercising reads and writes
through the new application, and asserting that the HTTP response still has
`item_title` (and does not expose `label` unintentionally). Confirm that a
fresh backup can be opened before declaring the migration complete.

To recover, stop the upgraded process, restore the pre-migration backup to a
new database file, and restart the previous application version against it.
If any writes were accepted after cutover, preserve that database and its
logs first; reconciliation of those writes is required before choosing the
restore point.

## Deployment B

Use a staged, additive migration because the old worker must continue to
query `item_title` for 48 hours:

1. Back up the database, add a nullable `label` column, and backfill it from
   `item_title` in a transaction.
2. Add synchronization triggers (or an equivalent persistence-layer guarantee)
   so changes made through the old column update `label`, and changes made
   through `label` update `item_title`. The new build should dual-write both
   columns during the overlap. This matters for inserts as well as updates,
   including writes from the old worker.
3. Deploy the new build. Internally it reads and reasons about `label`; its
   API mapper continues to return `item_title`. Keep the old build and the
   `item_title` column operational for the full 48-hour window.
4. During the window, continuously or periodically check that the two
   columns agree. After the old worker is retired and the window has passed,
   take another backup, switch fully to `label`, and remove the compatibility
   triggers/old column only in a later controlled migration.

The deployments differ because A has an exclusive stop-the-world window, so
duplicating data would add unnecessary complexity. B has two binaries with
incompatible schema expectations, so an additive compatibility period is
required; a direct rename would break the old worker immediately.

What must survive:

- all existing rows and values;
- writes from both builds during the overlap, with no last-writer ambiguity
  caused by unsynchronized columns;
- the old worker's ability to read `item_title` for 48 hours;
- the new code's internal `label` vocabulary;
- the HTTP API's `item_title` response contract.

Verify before deployment with row counts and a full equality check between
`label` and `item_title` after backfill. Test inserts and updates from each
build, including concurrent operations, and verify both columns converge.
During the overlap, monitor trigger errors, failed writes, row counts, and
the count of rows where the columns differ; that mismatch count must remain
zero. Exercise both worker versions and the HTTP contract. Before removing
compatibility, confirm the old worker is stopped everywhere, the 48 hours
have elapsed, and a fresh backup is readable.

For recovery during the overlap, stop the new build first and leave the old
worker on the additive schema; the additive change is backward-compatible.
If data corruption or trigger behavior cannot be corrected safely, stop both
builds, preserve the database and logs, restore the last known-good backup,
and resume the old worker. After the compatibility column is removed, use
the pre-removal backup to restore and roll back the application if recovery
is needed.
