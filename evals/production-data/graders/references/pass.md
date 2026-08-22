# Rename a persisted field and its API representation

## Obligation (from SIMPLE.md)

- Retained customer records must survive the change.
- Published API clients exist now, and a 90-day deprecation promise covers the old
  API field name. Old and new clients must both work during that window.
- The database column name is not itself a published contract — only the API
  representation is. Nothing in the profile says any external system reads the
  column directly, so the column rename does not need to wait for the 90-day window.
- Schema changes use the service's existing migration mechanism (the ordinary path);
  no new migration tooling is justified.

This splits into two independent obligations with two different timelines: the data
rename (service's own timeline, needs rollback safety) and the API rename (90-day
externally promised timeline, needs an adapter with an exit condition).

## Data layer: migrate the data, not the interface

No external caller depends on the column name, so this does not need dual APIs or a
long-lived compatibility path — just a safe migration:

1. Add the new column via the existing migration mechanism.
2. Backfill the new column from the old column's values (batched, matching the
   mechanism's ordinary pattern for non-locking backfills).
3. Cut the service's read/write code over to the new column.
4. Verify the backfill (row count and value comparison between old and new column)
   before removing anything.
5. Once verified and past the service's own rollback window, drop the old column in
   a later migration.

This can complete well before the 90-day API deprecation ends — it is decoupled from
it. Do not gate the internal rename on API client migration; that would extend an
internal change to match an external promise it isn't part of.

## API layer: one bounded adapter with an exit condition

Real old and new callers exist against a published field name, so the smallest
honest path is one translation adapter at the serialization boundary, not API
versioning, dual endpoints, or a feature flag:

- Accept either the old or the new field name on input; both map to the same
  internal field (it's a rename, not two fields, so there's no merge ambiguity).
  Reject requests that send both names with conflicting values.
- Emit both field names with the same value on output during the deprecation
  window, so old clients keep reading the old name and new clients can adopt the
  new name immediately.
- Keep the internal domain model and storage using only the new name; the adapter
  is the only place that knows the old name exists.

Exit condition (from SIMPLE.md's "Reconsider when"): remove the old name from the
adapter once the 90-day deprecation period has elapsed **and** telemetry/access
logs show zero requests using the old field name. Removing it earlier breaks the
compatibility promise; keeping it after that is an unrented permanent adapter.

## Proof

- Stored data: compare old and new column values (count and checksum/sample) after
  backfill and again before dropping the old column.
- Both API representations: contract tests asserting a request/response using the
  old field name and one using the new field name both resolve to the same stored
  value, for read and write paths.
- Rollback: confirm the migration has a working down-migration and that the service
  can run against the old column if redeployed before the old column is dropped.
- Removal criteria: do not delete the adapter's old-name handling until both are
  true — the 90-day period has elapsed, and traffic logs show zero old-field-name
  usage. Record this check before removing the adapter.

## What this avoids

No API version bump, no dual endpoints, no feature flag, no permanent adapter, and
no coupling the internal column rename to the external deprecation clock — none of
those are supported by an obligation in the profile. The only new machinery is one
field-name adapter at the API boundary, and it has a stated removal trigger.
