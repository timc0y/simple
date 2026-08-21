Requested outcome
Rename `account_id` to `customer_id` throughout the application.

Observed repository facts
- Stage and users: pre-launch, internal development only.
- External consumers: none.
- Persistent production data: none.
- Compatibility commitments: none.
- The field is meant to have one meaning throughout the application (Preserve).
- The application supports only its current development version (Current boundary).
- Ordinary path for this kind of change: rename through the existing model and its callers.

What must be preserved and what may be replaced
- Preserve: the single, consistent meaning of the identifier everywhere it appears (model, schema, API payloads, UI, tests, fixtures, docs) — the name changes, the concept and its behaviour do not.
- Replace freely: the literal identifier `account_id` itself, including in the database column/migration, ORM/model field, DTOs and serializers, API request/response keys, query params, internal variable and function names, config keys, seed/fixture data, and any stored test snapshots. Nothing here is a published contract, so there is no old surface to keep alive.

Existing owner and ordinary path
- The model (and its schema/migration) is the existing owner of this identifier. Every other layer (services, controllers/handlers, serializers, UI, tests) is a caller that derives its naming from the model.
- Ordinary path: rename the field at the model/schema level first, then follow the compiler/type-checker and test failures outward to update every caller. No new abstraction, adapter, or dual-naming layer is needed to do this.

Smallest truthful design
1. Rename the column/field on the model and its migration (a straight rename migration, not add-new-column-and-backfill, since there is no persistent production data to preserve).
2. Update the model's field/attribute name and any validators, associations, or indexes named after it.
3. Update all callers in one pass: services, controllers/handlers, serializers/DTOs, API route params and response keys, background jobs, seed data, and fixtures.
4. Update the frontend/client references (props, state keys, form fields, API client calls) to match.
5. Update tests and test data to use `customer_id`; do not keep tests pinned to the old name.
6. Grep the repository for the literal string `account_id` (including snake_case, camelCase `accountId`, and any string-interpolated occurrences in SQL, config, or logs) to catch stragglers outside the type-checked path.
7. Do not add a compatibility alias, dual-write, feature flag, or deprecation period for the old name — there is no consumer or retained dataset that depends on it.

Complexity removed or avoided
- No backward-compatible alias field, no dual-column migration with backfill, no versioned API contract for the old key, no feature flag, and no phased/staged rollout. All of these would be unpaid complexity given no external consumers, no persisted data, and no compatibility commitment.

Relevant precedent or standard, only if useful and its prerequisites exist
- None needed. This is an ordinary in-place rename; no external standard or migration pattern applies before launch.

Independent proof
- Run the full test suite and the type-checker (per this repository's stated proof: "Run the affected tests and type-check"). A clean run demonstrates the rename is complete and consistent independently of the diff itself.
- Additionally run a repository-wide search for the literal `account_id` / `accountId` after the change to confirm no caller, config, fixture, or string-built query was missed (type-checking alone won't catch stringly-typed references, e.g. in raw SQL or JSON).

Reconsideration condition
- If a consumer or retained dataset is later found to depend on `account_id` (e.g., an external integration, a persisted record, or a partner API contract), stop and re-plan with a compatibility layer instead of a direct rename. Until that fact exists, no such obligation should be built.
