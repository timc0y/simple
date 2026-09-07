# Migration decision

Use different storage changes for the two deployments:

| Deployment | Smallest workable migration |
| --- | --- |
| A | Rename the SQLite column from `item_title` to `label` while the process is stopped, then have the application map the published API field `item_title` to `label`. |
| B | Keep the SQLite column named `item_title` for the 48-hour overlap. Make the new application expose and use `label` internally while mapping it to the existing `item_title` column. Remove this mapping only after the old worker is retired; a later maintenance window can rename the column if that storage name still matters. |

## Why they differ

Deployment A has one coordinated application upgrade and migration. No external
process reads SQLite, and the process is stopped, so nothing needs the old column
during the change. Renaming the stored column gives the new internal name one source
of truth without requiring a compatibility layer. The HTTP serializer preserves
`item_title`, which is the published contract.

Deployment B has a known compatibility consumer: the older worker queries
`item_title` directly and must run beside the new build for 48 hours. Renaming the
column would break that worker. Keeping the existing column and mapping the new
internal name at the application boundary preserves both readers without adding a
second column or dual writes. This is a bounded compatibility path, not a new API
version.

## What must survive

- Every existing row and its current title value.
- The HTTP response field `item_title` in both deployments.
- In Deployment B, direct reads of the SQLite `item_title` column until the older
  worker has been retired after the 48-hour overlap.
- A single authoritative title value. Do not add `label` and maintain two writable
  columns.

## Verification

For Deployment A, before the change record the row count and a stable sample or
checksum of `(id, item_title)` values. After the migration, verify that the row count
and values match under `(id, label)`, the application reads and writes `label`, and
the HTTP API still emits `item_title` with the same values. Exercise a new-row write
and read through both the application and API.

For Deployment B, run old and new workers together against a copy of the production
database before rollout. Verify that the old worker can still read `item_title`, the
new worker reads and writes its internal `label` mapping, and both observe the same
values. Exercise an update from each build and confirm the other build sees it. Check
the API response separately. Record the retirement time of the old worker and do not
remove the mapping before the 48-hour requirement has elapsed.

## Recovery

For Deployment A, take the stated backup before changing the database. If schema or
value verification fails, stop the upgraded application, restore that backup, and
return to the previous application build. Do not proceed based on a partial rename.

For Deployment B, recovery is to leave the `item_title` column and mapping in place,
stop the new build if needed, and return to the old build. Because the migration does
not rename or duplicate the stored value, rollback does not require data conversion.
If a later rename is performed after the old worker is gone, back it up and verify it
like Deployment A; its rollback is restoring that backup and the prior application
build.

The compatibility mapping can be removed only when the older worker no longer runs
and no other direct `item_title` reader is supported. If that fact cannot be proved,
retain the existing storage name.
