# Decision

Rename the domain property to `returnReason` only. Keep `reason_code` at both
external boundaries: the HTTP adapter translates `reason_code` to and from
`returnReason`, and the repository translates `returnReason` to and from the
existing `returns.reason_code` column.

This is safe during the rolling deploy because old and new application
instances continue to read and write the same nullable column with the same
meaning. No old instance needs to understand `returnReason`, and no new
instance needs a different row shape. The reporting job continues to read the
column it owns today.

## Required change

1. Rename the domain-facing property and its internal uses from `reasonCode` to
   `returnReason`.
2. At the HTTP adapter, preserve the published JSON field `reason_code` for
   both `POST /v1/returns` input and `GET /v1/returns/:id` output.
3. At the repository, keep selecting and writing `returns.reason_code`, mapping
   it to `returnReason` at the domain boundary. Preserve null values.
4. Keep the change to the existing one-deploy application release. Do not
   change the schema or the meaning of the value.

The data flow remains:

`HTTP reason_code` ↔ `returnReason` ↔ `returns.reason_code`

Only the middle representation changes.

## Compatibility work to omit

Do not rename the database column, add a second column, dual-write, backfill,
or add a database migration. Another team reads `returns.reason_code`, and the
column is already the shared persisted contract.

Do not add an API version, accept a second JSON field, add a deprecation
window, or create a permanent compatibility adapter. Existing clients must
continue using `reason_code`, and the request does not authorize a new public
name.

Do not add feature flags, shadow reads, or synchronization jobs. The boundary
mappings are sufficient for the only real old/new representation difference.

## Checks that prove the plan

- API contract tests send and receive `reason_code` for non-null and null
  values, and verify that no `returnReason` field is published.
- Repository integration tests verify reads and writes against
  `returns.reason_code`, including preservation of null and existing values.
- A domain test verifies that the application uses `returnReason` internally
  and that both adapters perform the intended translations.
- A rolling-deploy check runs old and new application instances against the
  same unchanged database: each can read rows written by the other, and each
  writes values that the other can read.
- Verify the reporting job's existing SQL still reads the unchanged
  `returns.reason_code` column and that its representative output is unchanged.
- Exercise rollback by replacing new instances with the old release and
  confirm that API behaviour, reads, and writes remain valid. No data or schema
  rollback is required because neither is changed.

The plan should be reconsidered only if an unlisted consumer serializes the
internal domain object or requires the new name, or if the database column
cannot remain the shared persisted contract. Neither condition appears in the
provided context.
