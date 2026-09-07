# Migration decision

Use two different migrations because the deployments have different compatibility obligations.

## Deployment A

Rename the SQLite column from `item_title` to `label` in the same stopped migration that upgrades the application. Keep the stored value in one column. The application’s HTTP serializer maps `label` back to the published `item_title` field.

This is sufficient because no other process reads SQLite and the schema and application change happen together. There is no old database caller to support. Existing rows survive the supported column rename; take the available backup before changing the database.

Verify before reopening the process that:

- the row count and identifiers are unchanged;
- every old `item_title` value equals its new `label` value;
- application reads and writes use `label`;
- the HTTP response still contains `item_title` with the same values.

If migration or verification fails while the process is stopped, restore the backup and run the old application against the old schema. Do not reopen the upgraded application against a partially migrated database.

## Deployment B

Keep `item_title` addressable for the 48-hour overlap. Add `label`, backfill it from `item_title`, and deploy the new application to read and write `label`. During the overlap, maintain the old column from `label` writes with a database trigger or the existing write owner, so the older worker continues to observe current values. The API serializer continues to return `item_title` from `label`.

After the older worker is retired and the 48-hour compatibility window has ended, verify that no old build remains, reconcile the two columns, and remove the compatibility column and synchronization path in a separate migration. The final schema can then match Deployment A: one stored `label` value and an API mapping to `item_title`.

This is a bounded compatibility adapter, not a second permanent source of truth. The fixture says the older worker queries `item_title`; it does not say whether it writes it. The plan therefore requires confirming that those queries are read-only before rollout. If the old worker also writes `item_title`, use bidirectional synchronization with explicit conflict rules, or keep `item_title` as the write owner for the overlap; a one-way `label`-to-`item_title` sync would not preserve those writes.

Verify Deployment B at each boundary:

1. After backfill, compare row count, identifiers, and values in `label` and `item_title`.
2. With both builds running, write through the new application and confirm the old worker’s `item_title` query sees the new value.
3. Confirm the new application reads `label` and the HTTP API still emits `item_title`.
4. Before cleanup, confirm the old worker is stopped and no deployment or scheduled job can restart it.
5. After cleanup, repeat the row/value checks and exercise both the new application path and the published API.

If the new build must be withdrawn during the overlap, leave `item_title` and its synchronization in place and run the old build; values written by the new build must already have been propagated to `item_title`. If cleanup has started, stop and restore the pre-cleanup database or use the migration’s transaction/backup according to the available operational procedure. Do not drop `item_title` until the old reader is retired and the final verification passes.

The deployments differ only because Deployment B has a live old caller. The behaviour that must survive in both is every existing row and the published HTTP field `item_title`; only the internal storage name changes. No new service, watcher, framework, PR workflow, or permanent compatibility layer is justified by the stated requirements.
