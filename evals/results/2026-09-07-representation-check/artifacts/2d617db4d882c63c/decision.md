# Migration decision

Use the smallest migration that matches each deployment’s compatibility window.

## What must survive

- Every existing row and its current title value.
- The published HTTP field `item_title`.
- Normal service operation for the stated deployment window.
- A recoverable copy of the SQLite database before any schema change.

Internal application code should read and write `label`. The HTTP adapter should
continue to translate `label` to the published `item_title` field.

## Deployment A

Stop the process, take the database backup, rename the SQLite column from
`item_title` to `label`, and deploy the application change with that migration.
Run the migration in a transaction supported by the SQLite version in use. The
application’s HTTP response mapping keeps returning `item_title` even though the
stored and internal name is now `label`.

This is sufficient because no external process reads SQLite and the process is
stopped while the schema and application change happen together. There is no
compatibility period that requires the old column name to remain.

Verify that the renamed table contains the same row count and title values as the
backup, that application reads and writes use `label`, and that an HTTP response
still contains `item_title` rather than `label`. Exercise a create and update so
the check covers writes as well as existing data.

If migration or startup fails, stop the process and restore the pre-migration
backup, then run the previously deployed application. If a post-deployment data
check fails, do not continue operating on the partially trusted database; restore
the backup and investigate before retrying.

## Deployment B

Keep `item_title` and add a temporary `label` column. Backfill `label` from
`item_title` before starting the new build. The new build reads and writes
`label`, while the old worker continues to use `item_title` for its 48-hour
compatibility window. During that window, keep the two columns synchronized for
all writes. The safest small implementation is a pair of narrow SQLite triggers
that copies a changed value from either column to the other, with guards that
avoid recursive updates. If the old worker is strictly read-only, dual-writing
from the new build is enough; the trigger form preserves correctness if its
queries also write.

The HTTP adapter continues to expose `item_title`, sourced from the new internal
`label` value. After the old build has been stopped and the 48-hour window has
ended, verify that no old worker remains, confirm the two columns agree, remove
the compatibility triggers, drop `item_title`, and retain `label` as the stored
column. Take a backup before this cleanup as well.

This differs from Deployment A because renaming or dropping `item_title` during
the overlap would break the old worker’s unchanged query. Adding the new name
temporarily preserves that consumer while allowing the new build to adopt
`label`.

Verify the staged migration before rollout by comparing row counts and values,
then run both builds together. Check an old-worker read, a new-build read, a new
build write, and—if the old worker writes—an old-worker write followed by a new
build read. Check the HTTP field name and value after each relevant write. Before
cleanup, compare the columns for all rows and record that no rows disagree.

If the staged migration or overlap fails, stop the new build and leave
`item_title` plus its synchronization path in place; the old worker remains the
recovery-compatible application. Restore the latest known-good backup if data
values or synchronization cannot be trusted. During cleanup, restore the
pre-cleanup backup and redeploy the overlap-compatible build if the old worker
still needs the column or any validation fails. Do not drop `item_title` until
the worker retirement and agreement checks have succeeded.

## Decision boundary

Do not use Deployment A’s rename directly in Deployment B. The deployment choice
is determined by whether an unchanged SQLite consumer must overlap the migration,
not by the HTTP API name. In both deployments, the API compatibility mapping is
independent of the temporary or final SQLite column name.
