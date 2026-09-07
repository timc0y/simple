# Migration decision

Use different migrations for the two deployment shapes. Deployment A can rename
the stored column in one stopped, backed-up change. Deployment B must retain
`item_title` for 48 hours while the older worker is still running, then remove
that compatibility column after the old build is gone.

## Deployment A

1. Stop the process and take the available SQLite backup.
2. Apply the database's supported column-rename migration from `item_title` to
   `label`.
3. Upgrade the application in the same stopped deployment.
4. Keep the HTTP serializer mapping the internal `label` value to the published
   `item_title` field.

This is the smallest change because no other process reads SQLite in this
deployment. There is one stored value, internal code uses `label`, and the
published API contract remains `item_title`. Existing rows survive the rename;
the backup is the recovery point if the migration or application upgrade fails.

Verify that the renamed schema contains `label`, every pre-existing row retains
its title, internal reads and writes use `label`, and an HTTP response still
contains `item_title` with the same values. If verification fails, stop the
application and restore the pre-change SQLite backup, then run the old build.

## Deployment B

For the 48-hour overlap, add a `label` column and leave `item_title` in place.
Backfill `label` from `item_title` before starting the new build. New internal
code reads and writes `label`; the HTTP serializer still emits `item_title`.
Keep `item_title` synchronized with `label` for the overlap if the new build
writes titles, so the older worker does not observe stale values. The sync can
be in the existing write path; use a database trigger only if both builds can
write and the existing write path cannot cover both.

After the 48-hour support window, confirm that the older worker is stopped or
upgraded and that no remaining caller reads `item_title`. Then use a separate
cleanup migration to remove the compatibility column and its synchronization
logic. Do not remove it merely because the new build is deployed: the old
worker is the explicit consumer that makes the column necessary.

This deployment needs a temporary adapter because a live old reader cannot
operate against a renamed column. It does not need a permanent API version,
dual storage after the window, a watcher, or a new service. The published HTTP
field remains `item_title` in both deployments, independently of the internal
storage name.

Verify before rollout that all existing rows are backfilled, the old worker can
still query `item_title`, the new build uses `label`, and API responses remain
unchanged. During the overlap, compare the two columns after writes and watch
for failed or stale reads. Take a backup before adding the column and before
the cleanup migration. If the new rollout fails, keep the old worker and
`item_title` column in service and restore the backup only if the database
state cannot be repaired safely. If cleanup fails, leave the compatibility
column in place and retry after confirming the old build is gone; cleanup is
not required for the active service to operate.

## What must survive

- Every existing item title and its association with the same row.
- The HTTP response field named `item_title` and its values.
- Operation of the older worker throughout Deployment B's 48-hour window.
- A recoverable pre-change database state for each schema-changing step.

The compatibility column in Deployment B is temporary state, not a second
long-term source of truth. Once the old reader is retired, `label` is the sole
stored value and the API serializer remains the only translation to
`item_title`.
