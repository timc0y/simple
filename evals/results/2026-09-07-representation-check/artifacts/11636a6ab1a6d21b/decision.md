# Migration decision

Use a direct column rename for Deployment A. Use a bounded compatibility mapping for Deployment B, then rename the column only after the old worker has been retired.

## Deployment A

Stop the process, take and validate a backup, and apply one SQLite schema migration that renames `item_title` to `label`. Upgrade the application in the same stopped change:

- Internal code reads and writes `label`.
- The HTTP serializer maps `label` back to the published `item_title` field.
- There is one stored value and one database column.

No external process reads SQLite, so keeping a second column or dual writes would preserve an obsolete representation without serving a consumer. Existing rows are retained by the rename; their values must not be transformed.

Verify the migration before reopening the service:

1. Confirm the backup can be opened and contains the expected database.
2. Compare row counts and the old title values from the backup with `label` values in the migrated database.
3. Check that the schema has `label` and no longer has `item_title`.
4. Exercise a read and write through the application and confirm the HTTP response still contains `item_title` with the same value.

If migration or application startup fails, keep the service stopped, restore the pre-change backup, and start the previous application build. Do not resume with a partially migrated database.

## Deployment B

During the 48-hour overlap, leave the physical SQLite column as `item_title`. Update the new build's database boundary so its internal `label` field maps to that column, while its HTTP serializer continues to publish `item_title`. The older worker can therefore keep issuing its unchanged query, and both builds use the same stored value.

This is a real compatibility obligation: the older worker is a database consumer even though no unrelated external process queries SQLite. Adding a second `label` column and synchronizing both columns would create an unnecessary consistency problem. The mapping is the smallest adapter that lets the new internal name coexist with the old stored contract.

For the overlap, verify both callers against the same database:

- The old worker's unchanged query still returns the expected values.
- The new build reads and writes through internal `label` and the old worker observes those writes through `item_title`.
- The HTTP API still returns `item_title`.
- Row counts and title values remain unchanged apart from intentional writes.

After 48 hours, once the old worker is stopped and cannot restart against this database, take a fresh backup and perform the Deployment A rename with all database consumers stopped. Remove the temporary mapping only after the new build uses the renamed column successfully. The compatibility path ends when the old worker is retired; it is not a permanent dual-storage design.

If the new build fails during the overlap, roll it back while leaving `item_title` unchanged; the old worker remains usable. If the final rename fails, keep all consumers stopped, restore the immediately preceding backup, and restart the compatible pre-rename build. Recheck that backup and restore procedures preserve the rows before resuming service.

## Invariants

Both deployments must preserve:

- Every existing row and its title value.
- The published HTTP field name `item_title`.
- Successful reads and writes through the supported application path.
- A recoverable pre-change database and a known rollback build.

The deployments differ only because Deployment B has a live old caller of the stored name during a defined 48-hour window. Once that caller is gone, both deployments converge on one `label` column with the API translation at the boundary.
