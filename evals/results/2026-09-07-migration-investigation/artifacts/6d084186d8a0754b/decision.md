# Migration decision

Use two migration shapes because the deployments have different compatibility
obligations:

- Deployment A can rename the stored column from `item_title` to `label` in one
  stopped operation.
- Deployment B must keep `item_title` readable for the older worker during the
  48-hour overlap. Add `label` beside it, synchronize both columns during the
  overlap, and remove `item_title` only after the old worker is gone.

In both deployments, the HTTP response continues to expose `item_title` by
mapping the internal `label` value at the API boundary. The rows and their title
values must survive unchanged.

## Deployment A

Stop the process, take the SQLite backup, rename the column to `label`, and
upgrade the application in the same maintenance window. The application reads
and writes `label`; the HTTP serializer emits that value under `item_title`.

This is the smallest migration because the fixture identifies no external SQLite
consumer and the process is stopped while the schema and application change
together. No compatibility column, adapter, dual write, or feature flag is
needed.

Before starting the upgraded process, verify that the new schema contains
`label`, that the row count is unchanged, and that representative or complete
title values match the backup. Exercise an HTTP response and confirm that its
field is still `item_title`, not `label`. Exercise a write and read it back
through both the internal path and the HTTP path.

If verification fails, stop the process and restore the pre-migration SQLite
backup, then run the old application against that restored file. The backup is
the recovery point; do not attempt an in-place reverse rename on a failed,
partially upgraded database.

## Deployment B

During the 48-hour overlap, keep `item_title` and add `label` to the same table.
Backfill `label` from `item_title` before the new build serves traffic. The new
build uses `label`; the old worker continues to query `item_title`.

Install bounded synchronization while both builds can access the database:

- writes through the new path update `item_title` as well as `label`;
- writes through the old path update `label` as well as `item_title`;
- inserts from either build populate both columns.

SQLite triggers are the database-level way to enforce this when the old worker's
SQL cannot change. The synchronization must be guarded so an update that copies
the same value does not recurse. If the worker is proven read-only, the reverse
write rule is unnecessary, but that proof should be recorded before omitting it.

During the overlap, verify both builds against the same database: compare values
after writes from each build, confirm old-worker reads still return
`item_title`, confirm new internal reads use `label`, and confirm the HTTP
response remains `item_title`. Also check that row counts and title values do not
change during the backfill.

After 48 hours, stop and remove the old worker, confirm that no old build or
direct `item_title` consumer remains, and take a fresh backup. Remove the
synchronization, remove the `item_title` column using the SQLite-supported
schema-change path, and keep `label` as the stored column. Re-run the same data
and API checks. The compatibility path is removable only after the old worker
has stopped and its direct query is no longer a supported consumer.

If the overlap migration or post-overlap cleanup fails, keep both columns and
the synchronization in place, stop the affected rollout if necessary, and
restore the latest known-good backup if data integrity is in doubt. The old
worker can continue using `item_title` while the cleanup is repaired. For an
irreversible or uncertain data failure, restore the backup to a separate SQLite
file first and compare it before replacing the live database.

## What survives

- Every existing row and its title value.
- The published HTTP field name `item_title` in both deployments.
- The old worker's direct `item_title` query throughout Deployment B's 48-hour
  support window.
- A recoverable pre-change database backup before each destructive schema step.

The internal storage and code name becomes `label`. `item_title` is retained only
where the deployment has a real old caller, and only for the stated overlap.

## Decision boundary

If another process, supported version, audit requirement, or retained data source
is discovered, reassess the migration before applying it. In particular, do not
drop `item_title` in Deployment B until the 48-hour period has elapsed and the
old worker has been demonstrably retired.
