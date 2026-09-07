# Migration decision

Use a direct column rename for Deployment A. Use a temporary compatibility
column for Deployment B. In both deployments, the internal model and queries
use `label`; the published HTTP response continues to emit `item_title`.

## Deployment A

The process is stopped while the application and migration change together.
There is no old SQLite caller to preserve, and existing rows must survive.

1. Take the available SQLite backup.
2. Rename the stored column `item_title` to `label` in the migration. A
   SQLite column rename preserves the table's existing rows.
3. Change the application mapping so its internal `label` is serialized as
   HTTP field `item_title`.
4. Start the new application only after the migration succeeds.

This keeps one stored value and one owner. The API name is a published
contract, so it is preserved at the HTTP boundary rather than in the
database schema.

Verify the migration before serving traffic: inspect the schema, confirm the
row count and representative values match the backup, exercise an internal
read/write using `label`, and confirm the HTTP response still contains
`item_title` and not `label`. If any check fails, stop the application and
restore the pre-change SQLite backup, then restart the old application.

## Deployment B

The older worker directly queries `item_title` and must run beside the new
build for 48 hours. Renaming or dropping that column at the first deployment
would break the old worker when it prepares its query.

For the compatibility window:

1. Add a nullable `label` column while retaining `item_title`.
2. Backfill `label` from `item_title` and verify that every existing row has
   the same value in both columns.
3. Make the new build read and write `label` internally, while its write path
   updates both columns with the same value. Keep the HTTP mapping from
   internal `label` to public `item_title`.
4. Run both builds for the stated 48 hours. Confirm the old worker still
   completes its `item_title` query and that new writes keep the two columns
   equal.
5. After the old worker is retired and no longer able to start, verify the
   columns are equal again, then remove the compatibility `item_title`
   column in a separate migration. Keep the HTTP mapping unchanged.

This is a bounded adapter for one named old caller, not a second permanent
source of truth. The decision assumes the older worker is read-only, as the
context says it queries `item_title`. If it can write rows, the plan must add
an owned synchronization mechanism (such as a trigger or an old-worker
upgrade); otherwise new `label` reads can miss those writes.

Verify during the window with schema checks, a full equality check between
`label` and `item_title`, an old-worker query, a new-build read/write, and an
HTTP response check. Before removing `item_title`, take a fresh backup and
retain the previous compatible application/database pair. If dual-column
verification fails, stop the new writer, preserve the database for diagnosis,
and restore that pair rather than attempting another migration over uncertain
state. Remove the compatibility column only after the 48-hour caller
obligation has ended.

## What must survive

- Every existing row and its `item_title` value.
- The internal semantic name `label` in the new build.
- The published HTTP field `item_title`.
- Deployment B's old worker query for exactly its required 48-hour window.
- A recoverable pre-migration database and a known compatible application
  version for each destructive step.

The deployments differ only because Deployment B has a real overlapping old
consumer. No versioned API, feature flag, watcher, framework, service, or
permanent dual-write path is justified by the stated requirements.
