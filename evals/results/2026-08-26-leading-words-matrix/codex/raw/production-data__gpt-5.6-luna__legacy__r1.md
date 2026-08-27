## Proposed implementation

The repository contains no application code, schema, or API definitions, so exact file and symbol changes cannot be named. Based on `SIMPLE.md`, use this design:

1. Add a reversible schema migration through the existing migration mechanism.

   - Rename the persisted field from `old_name` to `new_name`.
   - Preserve all values.
   - Make the migration fail if the destination already contains conflicting data.
   - Provide the inverse migration for rollback and verify counts and representative records before and after.

2. Make `new_name` the sole internal and persisted representation.

   - Update the model, queries, validation, serializers, and tests to use `new_name`.
   - Do not add dual writes or a second source of truth.

3. Add one compatibility adapter at the public API boundary for the 90-day deprecation period.

   - Accept `new_name` for new clients.
   - Accept `old_name` for existing clients and normalize it immediately to `new_name`.
   - If both are supplied, accept them only when their values match; otherwise return a validation error.
   - Emit the representation selected by the existing API versioning or content-negotiation mechanism. Keep the old representation available only through that bounded compatibility path.

4. Instrument use of `old_name`.

   - Record old-field requests without storing duplicate customer data.
   - At the end of 90 days, remove the adapter only after old-client traffic reaches zero and the deprecation commitment has elapsed.
   - Then remove the old API schema, compatibility tests, telemetry, and related documentation.

Proof should cover migrated data, new and old API representations, conflicting inputs, rollback, and the removal criteria. The unresolved repository fact is how API representations are currently selected; the adapter should reuse that existing mechanism rather than introduce a new versioning system.
