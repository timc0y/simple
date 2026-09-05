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

- No consumers and no retained state: replace directly.
- Retained data but no old callers: migrate the data, not the interface.
- Real old and new callers: use one bounded adapter with an exit condition.
- Irreversible or high-risk data change: add backup, verification, and recovery.

Do not create versions, dual writes, shadow systems, feature flags, or permanent
adapters for imagined adoption. Record who needs compatibility, what contract is
preserved, how it is proved, and when the compatibility path can be removed.
