# Decision

Use `returnReason` only as the new internal domain property. Keep `reason_code` as
the JSON field and PostgreSQL column, and translate at the existing boundaries:

```text
HTTP reason_code  ->  domain returnReason  ->  database reason_code
HTTP reason_code  <-  domain returnReason  <-  database reason_code
```

This preserves the published API and the persisted representation while allowing
new application code to use the clearer name. No schema or data migration is
needed.

## Why this is safe during the rolling deploy

The old and new application instances both read and write the existing
`returns.reason_code` column. The reporting job continues to read that column
without change. The HTTP adapter continues to accept and emit `reason_code`, so
existing clients see the same request and response shape.

An old instance uses its existing `reasonCode` domain property and a new instance
uses `returnReason`, but neither property is stored or sent between instances.
Their shared state is the unchanged database row, whose value and nullability are
unchanged. Therefore mixed old/new instances remain interoperable for the whole
rollout and an old version can be used for rollback without a schema rollback.

## Plan

1. Rename the domain model, service inputs, outputs, and internal call sites owned
   by this team from `reasonCode` to `returnReason`. Preserve the existing meaning
   and nullable type.
2. Update the HTTP adapter's request mapping from `reason_code` to `returnReason`
   and its response mapping from `returnReason` to `reason_code`. Do not expose
   `returnReason` in the public JSON contract.
3. Update the repository mapping from `returnReason` to the existing SQL
   `reason_code` column and back again. Keep the existing SQL column, value
   encoding, and null handling unchanged.
4. Deploy the application as the single rolling release. Do not run a database
   migration as part of this change.

## Checks that prove the plan

- API contract tests send and receive `reason_code` and verify that
  `returnReason` is absent from JSON. Cover a non-null value and `null`.
- Repository integration tests write and read through the application mapping and
  verify that the database interaction still uses `returns.reason_code`, including
  null values and existing values.
- A mixed-version rollout test runs old and new application code against the same
  unchanged database and verifies create/read behaviour in both directions.
- Verify the reporting job's existing query still returns the same values from
  `returns.reason_code`; no reporting SQL should change.
- Run the existing application test suite and inspect the generated SQL or query
  assertions for accidental column renames.
- Confirm rollback by starting the old application version against the unchanged
  schema and exercising the same API contract.

## Work deliberately omitted

- No database column rename, second column, backfill, dual write, or data cleanup:
  the retained column already satisfies both the application and reporting
  consumers.
- No API version, deprecation window, or compatibility alias for
  `returnReason`: clients are explicitly required to keep using `reason_code`.
- No reporting-job change: its direct read is an existing external contract.
- No feature flag or separate migration release: the representation at every
  shared boundary remains unchanged.

The compatibility path is the two explicit boundary mappings. It can be removed
only if the published `reason_code` API and the reporting job's direct column read
are both retired; neither retirement is part of this request.
