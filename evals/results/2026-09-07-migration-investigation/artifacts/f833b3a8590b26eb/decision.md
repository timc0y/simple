# Migration decision

Use one stored value and keep the published HTTP field named `item_title`.
The deployments differ only in whether an old process still needs the old SQLite
column name.

## Deployment A

Rename the SQLite column from `item_title` to `label` as part of the stopped
application upgrade. Update the service's internal reads and writes to use
`label`. At the existing HTTP serialization boundary, map `label` back to the
published `item_title` field.

This is the smallest migration because the service owns the database, no other
process reads it, the application and schema change happen together, and the API
contract—not the SQLite column name—is the compatibility obligation. Do not add a
second column or dual writes.

Before changing the database, take the permitted backup. Apply the database's
supported column-rename migration, then start the upgraded application. Existing
rows and their values must remain in the renamed column; only the internal name
changes.

Verify all of the following before declaring the deployment complete:

- the migrated schema contains `label` and no longer relies on `item_title`;
- the row count and a representative or complete value comparison match the
  pre-migration backup;
- normal service operations read and write through the internal `label` name;
- the HTTP response still contains `item_title` with the same values and no
  accidental replacement by `label`.

If verification fails, stop the upgraded application and restore the pre-change
backup, then run the old application against that restored schema. Do not point
the old application at the renamed database: its expected column is absent.

## Deployment B

During the 48-hour overlap, leave the physical SQLite column named `item_title`.
Make the new build's database/repository boundary expose that stored value to its
internal model as `label`, and map `label` back to `item_title` at the HTTP API
boundary. The new build may continue to issue SQL against the old physical column
behind that boundary. The older worker can therefore keep querying `item_title`
while both builds operate on the same value.

This is the smallest workable compatibility path because the old worker is a real
consumer, its query cannot change during the window, and the fixture says it only
queries the database. There is no need for a second column, dual writes, a trigger,
a service, or a framework. Two columns would create a synchronization and recovery
obligation that the requirement does not need.

The compatibility path has a clear exit condition: after the 48-hour window,
confirm that the old worker is stopped or upgraded and that no old reader remains.
Then use the Deployment A schema rename in a separate stopped migration, retaining
the same internal `label` model and HTTP `item_title` mapping. Until that condition
is proven, do not remove or rename `item_title`.

Verify the overlap through both consumers:

- the older worker successfully executes its unchanged `item_title` query;
- the new build reads and writes the same values through its internal `label`
  model;
- the HTTP response remains `item_title`;
- a value written by the new build is visible to the old query, and a value
  written by any supported writer is visible to the new build; and
- after retirement, a schema check confirms that the old reader is gone before
  the physical rename is attempted.

Take a backup before the eventual rename. If the overlap build fails, keep the
physical schema unchanged and roll back the new build; the old worker remains
usable. If the post-window rename fails, stop the upgraded application and restore
the pre-rename backup, then run the last compatible build. Do not restore only the
application or only the database: the application and physical schema must be a
matched pair.

## What must survive

- Every existing row and its title value.
- The published HTTP field name `item_title` and its values.
- Operation of the unchanged older worker throughout its 48-hour window.
- One authoritative stored value; no unverified dual-write state.
- A recoverable pre-rename database and a rollback path whose application expects
  that database schema.

The decisive fact is the old worker's direct database dependency. Without it, the
storage rename is a local migration. With it, the old column name is a temporary
compatibility interface and can be removed only after the named reader has exited.
