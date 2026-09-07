# Migration decision

Keep one stored value and expose the published name at the HTTP boundary. The
physical SQLite rename is immediate in Deployment A and is deferred until the
48-hour compatibility window ends in Deployment B.

## Deployment A

The process is stopped while the application and schema change are applied
together. Before changing anything, take a SQLite backup.

1. Rename the SQLite column `item_title` to `label` using SQLite's supported
   schema migration.
2. Change internal queries and application code to use `label`.
3. Keep the existing HTTP serializer returning `item_title`, reading its value
   from `label`.

This is the smallest migration because no external process reads the database.
There is no reason to retain a second column or dual-write path. The backup is
the recovery point if the migration or upgraded application cannot operate.

## Deployment B

The old worker is a real compatibility consumer: for 48 hours it queries the
physical `item_title` column and cannot be changed. Do not rename that column at
the start of the rollout.

During the compatibility window:

1. Keep `item_title` as the sole stored column.
2. Make the new application's database boundary expose that value internally as
   `label` (for example, select `item_title AS label` and write through the
   existing `item_title` owner).
3. Continue serializing the HTTP response field as `item_title`.
4. After the old worker has been stopped and the 48-hour window has expired,
   take a backup, rename `item_title` to `label`, and remove the temporary
   database alias.

The alias is bounded compatibility at the existing database boundary; it is not
another source of truth. Adding a `label` column and dual-writing would create
consistency and recovery work without satisfying an additional requirement.

## What must survive

- Every existing row and its `item_title` value.
- The meaning and identity of each item; this is a rename, not a data rewrite.
- The published HTTP response field `item_title` in both deployments.
- In Deployment B, successful reads by the old worker throughout its 48-hour
  support window.
- A usable backup from before each physical schema change.

## Verification

For Deployment A, before and after the migration compare the row count and a
stable per-row identity-to-title sample (or a checksum produced from those
values). Exercise the upgraded application's reads and writes, confirm the
database exposes `label`, and call the HTTP endpoint to confirm it still emits
`item_title` with the preserved values.

For Deployment B, while both builds run, verify that the old worker's unchanged
query still succeeds, the new build reads and writes through its internal
`label` boundary, and the HTTP response remains unchanged. At the end of the
window, record that the old worker is stopped before renaming the column. Then
repeat the Deployment A checks and confirm no `item_title` column is required by
the new build.

Each check must compare values, not only successful process startup; a wrong
alias or an empty result could otherwise look healthy.

## Recovery

If Deployment A fails, stop the upgraded process and restore the pre-migration
SQLite backup, then run the previous application build. Do not retry a failed
write or migration until the database state has been checked.

If the Deployment B compatibility rollout fails before the final rename, keep
`item_title` in place and roll back the new build; the old worker's path remains
usable. If the final rename fails, restore the backup taken immediately before
that rename and keep the old schema/build pairing until the cause is understood.
After a successful rename, rollback means restoring that backup and running a
build that expects `item_title`, or applying a tested reverse rename before
starting such a build. The backup and the application/schema pairing must be
treated as one recovery unit.

The physical rename should be reconsidered only if the old worker's retirement
cannot be established after 48 hours; in that case, retain the bounded alias and
do not introduce a second stored value without a new compatibility decision.
