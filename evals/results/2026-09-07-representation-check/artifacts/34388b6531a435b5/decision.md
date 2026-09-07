# Migration decision

Use a direct SQLite column rename in Deployment A. Use a bounded compatibility
column in Deployment B because the old worker still reads `item_title` during
the rollout.

## Deployment A

Stop the process, take the available backup, and apply one SQLite schema
migration that renames `item_title` to `label`. Update the application to use
`label` internally. Keep the existing HTTP serializer mapping `label` back to
the published `item_title` field.

This is sufficient because the application and schema change together, no
external process reads SQLite, and there is no old caller that needs the old
column. Store one value, not two. Existing rows survive the supported SQLite
rename operation.

Verify before restarting the service that the `label` column exists, the row
count is unchanged, and representative old values are unchanged. After
restart, exercise a read and write through the application and confirm that the
HTTP response still contains `item_title` with the expected value.

If the migration or post-restart checks fail, stop the new process and restore
the pre-change backup, then restart the previous application build. Do not
attempt an in-place reverse migration unless the backup is unavailable and the
data has been separately preserved.

## Deployment B

Keep `item_title` for the 48-hour overlap and add `label` as a compatibility
migration:

1. Add `label` without dropping or renaming `item_title`.
2. Backfill `label` from `item_title` for every existing row.
3. Run the new build against `label` internally.
4. Preserve `item_title` in the HTTP response through the existing API mapping.
5. For writes made by the new build, write the same value to both columns so
   the old worker's direct reads remain current.
6. During the 48-hour window, verify that both columns agree. After the old
   worker is retired and the window is confirmed complete, remove the
   compatibility write and drop `item_title` in a later migration.

The old worker is the decisive difference: it cannot be changed during the
window and directly requires `item_title`. A direct rename would make that
worker fail. The extra column and bounded dual-write rule are therefore needed
only until that caller is gone; they must not become a permanent second source
of truth.

The context says the old worker queries `item_title`; it does not say that it
writes it. This decision preserves old reads. If the old worker also writes,
the migration must add a database-level synchronization mechanism for writes
from both builds, or the overlap cannot safely use application-only dual
writes.

Verify the backfill by comparing row counts, nullability/coverage, and sampled
or full-column equality between `label` and `item_title`. Run the old worker's
unchanged query while the new build reads and writes through its normal path.
Confirm the HTTP contract still exposes `item_title`, and monitor equality for
the full 48 hours. Only then remove the old-column compatibility path.

Keep a backup before the schema change and retain it through the overlap and
the first post-cleanup verification. If the new build fails, stop it and return
traffic to the old worker while `item_title` remains available. If the
backfill or cleanup fails, leave both columns in place and restore from backup
only after preserving any writes made since the backup; never drop the old
column until the old worker is retired and the equality checks pass.

## What must survive

- Every existing row and its `item_title` value.
- The published HTTP field name `item_title` and its values.
- The old worker's ability to read `item_title` throughout Deployment B's
  48-hour window.
- A recoverable pre-migration backup and a clear point at which the temporary
  compatibility path can be removed.

The database column name is not itself a permanent contract in Deployment A,
because no external process depends on it. It is a temporary compatibility
contract in Deployment B, bounded by the old worker's retirement.
