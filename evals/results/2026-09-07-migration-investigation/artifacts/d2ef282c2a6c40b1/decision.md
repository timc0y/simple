# Migration decision

Use a direct column rename in Deployment A. Use a temporary two-column compatibility bridge in Deployment B, then remove the old column after the 48-hour overlap. In both deployments, keep the API contract at the application boundary: read `label` internally and serialize it as `item_title` externally.

## What must survive

- Every existing inventory row and its `item_title` value.
- The published HTTP response field `item_title`.
- In Deployment B, the older worker's ability to query `item_title` for the full 48-hour overlap.
- Writes made during the Deployment B overlap, regardless of which build makes them.

No external process depends on the SQLite schema, so `item_title` is not otherwise a retained database interface.

## Deployment A

Stop the process, take the available backup, and apply the schema and application change together:

1. In a transaction, rename the SQLite column `item_title` to `label`.
2. Deploy the new application build. Its database code uses `label`; its HTTP serializer continues to emit `item_title`.
3. Commit and start the process.

The rename preserves the existing values without a copy or a second source of truth. The stopped process means no old query can observe the intermediate schema.

Verify the migration before treating it as complete:

- Confirm the schema has `label` and no longer has `item_title`.
- Compare the row count and a checksum or exact ordered export of the title values with the pre-migration backup.
- Exercise a read and write through the new application and confirm the HTTP response still contains `item_title` with the expected value.
- Check that application queries no longer refer to `item_title`.

If the transaction fails, roll it back before restarting. If the committed migration or application upgrade is not usable, stop the process and restore the pre-change backup, then restart the old application against the restored schema. Do not retry after an uncertain partial application change until the database and process state have been established.

## Deployment B

Do not rename or drop `item_title` during the overlap. Add `label` while retaining `item_title`, backfill `label` from `item_title`, and install a bounded compatibility bridge that keeps both columns equal:

- On inserts, populate a missing column from the other column.
- On updates to either column, update the other column only when the values differ.

The bridge belongs in SQLite so it covers writes from both the old and new worker builds. The new build reads `label` and, during the overlap, supplies both columns on writes; this also works if the existing `item_title` column is `NOT NULL`. The old build continues to read and write `item_title`, with the bridge filling or synchronizing `label`. The new build still maps `label` to the API field `item_title`.

Apply the add-column, backfill, and trigger changes as one migration while coordinating the workers so no write occurs against a half-created bridge. Run both builds for 48 hours. After that interval, establish that the old worker is stopped and cannot reconnect, then remove the compatibility triggers and `item_title` in a separate migration. Keep the new build's API mapping unchanged.

Verify the overlap and cleanup:

- Before the overlap, confirm every existing row has matching `label` and `item_title`.
- Test an insert and update from each build, then read the result through both column names and through the HTTP API.
- During the 48 hours, monitor for trigger errors and compare the two columns; any mismatch blocks cleanup.
- Before dropping the old column, verify worker versions and deployment state show no remaining old reader or writer.
- After cleanup, verify only `label` remains in SQLite, existing row counts and values are unchanged, and the API still returns `item_title`.

If the bridge migration fails before commit, roll back the transaction. If the bridge is committed but the new build is not usable, keep `item_title` and the old worker running; remove only the bridge additions after stopping the new writer, or restore a pre-migration backup if the database state is uncertain. During the overlap, do not drop `item_title` or disable the bridge as a recovery shortcut. If cleanup fails, leave the bridge in place and retry only after rechecking that the old worker is gone.

## Why the deployments differ

Deployment A has one stopped process, no old SQLite consumer, and an available backup. A transactional rename is therefore the smallest change and has one database source of truth.

Deployment B has a live, unchangeable consumer for 48 hours. Removing its column would break a required caller, so the extra column and SQLite-owned synchronization are necessary temporary compatibility state. Once that caller is demonstrably gone, the old path and its support machinery should be removed rather than made permanent.
