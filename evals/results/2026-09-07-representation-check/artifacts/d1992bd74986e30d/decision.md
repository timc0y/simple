# Decision

Use `returnReason` only inside the application domain. Keep `reason_code` at the
HTTP and PostgreSQL boundaries:

```text
HTTP reason_code <-> HTTP adapter <-> domain returnReason <-> repository <-> returns.reason_code
```

The one deploy is safe because old and new rolling instances continue to use the
same external and persisted names. Old instances can read and write the unchanged
`returns.reason_code` column, and new instances do the same after translating it
to and from `returnReason`. The reporting job therefore continues to read the
column it owns today.

## Change plan

1. Rename the domain property from `reasonCode` to `returnReason` in the owned
   domain-facing types and application use sites.
2. Update the existing HTTP adapter mapping so requests and responses still use
   `reason_code`. Do not expose `returnReason` in either JSON contract.
3. Update the existing repository mapping so `returnReason` reads from and writes
   to `returns.reason_code`, preserving nullability and the existing meaning.
4. Deploy the application without a database migration. During the rolling
   period, old and new instances share the unchanged database representation and
   can be rolled back without a schema mismatch.

## Compatibility work omitted

- No column rename, second column, backfill, or dual-write scheme: existing rows,
  the nightly reporting job, and the persisted contract require
  `returns.reason_code` to remain available, and the value has no meaning change.
- No API version, deprecation window, or request/response compatibility layer:
  clients must continue using the existing `reason_code` contract and there is no
  requested external name change.
- No feature flag, shadow path, or migration cleanup: the ordinary adapter and
  repository mappings are sufficient, and both application versions already
  share the unchanged boundary contracts.

## Checks

- Compile and run the application tests, including type checks that catch stale
  `reasonCode` references.
- Exercise the HTTP contract with `POST /v1/returns` using `reason_code`, then
  `GET /v1/returns/:id`; assert that responses still contain `reason_code`, not
  `returnReason`.
- In PostgreSQL integration tests, verify that a new instance writes and reads
  `returns.reason_code`, including `NULL`, and that it reads rows created before
  the deploy without changing their values.
- Run a rolling-compatibility check with old and new application versions against
  the same unchanged schema: each version must read and write the same records.
- Verify directly that the reporting query still returns the expected values from
  `returns.reason_code`.
- Perform the normal rollback check: an old instance must start and serve records
  written by a new instance. No database rollback is required because the plan
  makes no schema or data change.

Reconsider this plan only if the HTTP contract, the reporting job, or the database
column must also be renamed. That would establish a separate migration and
compatibility obligation not present here.
