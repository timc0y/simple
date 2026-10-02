# Compatibility and migrations

Use this before preserving an old path, versioning an interface, or adding a data
migration.

## Establish the obligation

Check separately:

- external users or downstream repositories;
- published APIs, packages, URLs, schemas, files, or automation;
- production or user-owned data that must survive;
- supported versions and promised deprecation periods;
- rollback, audit, or regulatory requirements.

Existing code is not proof that compatibility is required. Neither is uncertainty.
Find evidence or mark the decision unresolved.

## Choose the smallest honest path

Separate the internal model, stored representation and published interface. A name
change in one does not require changing the others. Before adding a second stored
value or synchronization, check whether the existing boundary can translate for all
real consumers. If it cannot, name the incompatible requirement and keep the necessary
compatibility path bounded.

- No consumers, retained state, published contract, or support promise: replace directly.
- Retained data but no old callers: migrate the data, not the interface.
- Real old and new callers: use one bounded adapter with an exit condition.
- Irreversible or high-risk data change: add backup, verification, and recovery.

Do not create versions, dual writes, shadow systems, feature flags, or permanent
adapters for imagined adoption. Record who needs compatibility, what contract is
preserved, how it is proved, and when the compatibility path can be removed.

## Example: rename storage, preserve the API

An application owns a database column named `full_name`. The requested migration
renames that stored column to `display_name`, but a published API still promises
`full_name`. No other process
reads the database directly, and the deployment permits the schema and application
change together.

Rename the column with the database's supported migration and map `display_name`
to `full_name` in the existing API serializer. Keep one stored value. Two columns
and dual writes would preserve an internal shape that has no remaining consumer.
Verify retained values, the promised API field, and the actual rollback procedure.

The answer changes if an older application instance must keep using the old column
during rollout, or an external consumer queries it. Establish that consumer and
deployment constraint before choosing a bounded compatibility migration.

This example retains the useful Ponytail distinction from the
[historical comparison](../../../evals/results/2026-08-22-skill-interaction/README.md).
It illustrates the decision; it is not a new evaluation result.
