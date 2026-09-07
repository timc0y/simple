# Decision

Use the deployment boundary to choose the migration:

- Deployment A can rename the SQLite column from `item_title` to `label` while
  the process is stopped, then upgrade the application in the same change.
- Deployment B must keep the physical `item_title` column for the 48-hour
  overlap. The new build should use `label` internally and translate to
  `item_title` at its database boundary. Rename the column only after the old
  worker is confirmed gone.

In both deployments, the HTTP response continues to serialize the internal
`label` value as `item_title`. Existing row values, row count, and the
published response field are the invariants that must survive.

## Deployment A

Take the available SQLite backup, stop the process, and run the native column
rename as part of the application upgrade. Update internal database access to
use `label`; keep the API serializer's output key as `item_title`.

This is the smallest migration because there is no concurrent old caller. It
does not need a duplicate column, dual writes, a compatibility view, or a
second service. The backup is the recovery point if either the schema change
or the application upgrade is not usable.

Verify the schema has `label` and no longer has the old column name. Compare
the migrated row count and representative values with the backup, exercise a
read and write through the application, and make an HTTP request that confirms
the response still contains `item_title` with the expected value. Do not treat
an empty result as proof that data survived.

If verification fails, keep the process stopped, restore the pre-change
backup, and restart the old application version against that restored database.
If the process reached a partially changed state, establish the actual schema
and data before retrying; do not apply the migration a second time merely
because an upgrade command timed out.

## Deployment B

For the 48-hour overlap, leave the SQLite schema unchanged. Give the new
build an internal `label` field and a single database adapter that reads and
writes the existing `item_title` column, mapping it to `label` on the way into
the application. Keep the HTTP serializer mapping `label` back to the
published `item_title` key.

This preserves the direct query made by the older worker. Adding a `label`
column and dual-writing would create two stored values and a synchronization
obligation without solving a present requirement. A view or compatibility
service would add another owner for the same state.

During the overlap, verify that the old worker can still start and query, the
new build can read and write the same rows, and the HTTP response remains
unchanged. Record the end of the 48-hour window and confirm that no older
worker remains before changing the schema.

After that confirmation, stop all workers and perform the Deployment A-style
rename and application change as a separate controlled release. The release
must switch the database boundary to `label` at the same stopped boundary, so
there is no interval in which current code expects one physical name while the
schema has the other. The old-column adapter can then be removed; its removal
condition is the verified end of the 48-hour compatibility window.

If the overlap release fails, leave `item_title` in place and roll back only
the new build to the known-good build. If the later rename fails or its
verification fails, stop the workers and restore the pre-rename backup before
restarting the compatible build. Never restore an old worker against a database
whose only title column is `label`.

## Proof and boundary

The migration is complete when all of these are true:

- existing rows and their title values are present;
- current internal code uses `label`;
- the published HTTP response still uses `item_title`;
- Deployment B's old worker has had its direct `item_title` access preserved
  for the full 48-hour window; and
- the compatibility adapter is removed only after that window and its final
  schema change are verified.

The exact SQLite table name, SQLite version, and application migration command
are not given in the context. The implementation should use the existing table
owner and confirm that the deployed SQLite version supports the native column
rename before selecting the command. No implementation or publication is part
of this decision.
