## Proposed implementation

Use the existing migration mechanism and keep one canonical internal name: `new_field`.

1. Add `new_field` alongside `old_field` as a nullable persisted field.
2. Deploy application code that:
   - reads `new_field`, falling back to `old_field`;
   - writes both fields with the same value;
   - rejects requests containing conflicting values.
3. Backfill `new_field` from `old_field`, then verify row counts and value parity.
4. Update the API boundary with a bounded compatibility adapter:
   - accept both the old and new API property names;
   - expose the new representation to new clients;
   - continue exposing or accepting the old representation during the 90-day deprecation period, according to the service’s existing API-versioning convention.
5. After 90 days, confirm old-client traffic is zero, remove the old API mapping, stop writing `old_field`, and remove it through a follow-up migration.

The adapter should live at the API serializer/parser boundary; domain code should only use `new_field`. This preserves customer data, supports old and new clients, and gives rollback a usable schema during the transition.

Verify:

- existing records retain identical values;
- reads and writes work through both API representations;
- conflicting representations cannot diverge;
- rollback restores the previous application version without data loss;
- the old API mapping and persisted field are removed only after the deprecation promise ends and old traffic reaches zero.

The repository contains no actual field names, API versioning convention, or migration implementation, so those details must be resolved before coding.
