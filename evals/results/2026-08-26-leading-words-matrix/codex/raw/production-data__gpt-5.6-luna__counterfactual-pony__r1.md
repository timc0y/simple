The repository contains no implementation files beyond [`SIMPLE.md`]( /tmp/simple-leading-words-codex-matrix-20260826/run/production-data__gpt-5.6-luna__counterfactual-pony__r1/SIMPLE.md ), so the proposal must remain repository-neutral.

Use one canonical new field internally:

1. Add an existing schema migration that renames the persisted field in place, preserving values and indexes. Do not create a second stored field or dual-write path.
2. Update the domain model and ordinary read/write path to use the new name.
3. Add one bounded API adapter at the public boundary:
   - accept both old and new request representations;
   - map both to the canonical field;
   - emit the old representation for old API clients and the new representation for new clients using the existing version-negotiation mechanism.
4. Verify pre/post migration record counts and representative values, then exercise both API representations.
5. Make the migration reversible for rollback.
6. After 90 days, confirm old-client traffic is zero, remove the old API mapping and tests, and retain only the renamed persisted field.

Do not add feature flags, a second schema field, or a permanent compatibility layer. The unresolved implementation details are the exact field names, storage engine, and existing API versioning mechanism.
