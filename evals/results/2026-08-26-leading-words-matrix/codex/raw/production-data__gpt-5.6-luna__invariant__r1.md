## Proposed implementation

Assume `old_field` is being renamed to `new_field`.

1. Add `new_field` to the existing schema through the service’s migration mechanism. Keep `old_field` temporarily.
2. Backfill `new_field` from `old_field`, preserving nullability and exact values. Verify row counts and mismatches.
3. Deploy one application owner with this behavior:
   - New clients send and receive `new_field`.
   - Existing clients may send and receive `old_field`.
   - If both request fields are present, require equal values; otherwise reject the request.
   - Read `new_field` as canonical, falling back to `old_field` only for records not yet migrated.
   - Write the canonical value to `new_field` and, during the 90-day transition, also update `old_field` so rollback remains safe.
   - Mark `old_field` responses and request inputs as deprecated.
4. Measure old-field API traffic and confirm all persisted records have the new value.
5. After 90 days, when old-client traffic reaches zero, remove the old API representation and its adapter.
6. In a later migration, drop `old_field` after a final backup and verification.

Do not expose both names as independent data. The new field is the source of truth; the old name is a bounded compatibility adapter.

Verify independently through the public API and database:

- Existing clients continue to read and write `old_field`.
- New clients read and write `new_field`.
- Records retain their values through migration.
- Mismatched dual inputs are rejected.
- Application rollback can still read the old persisted field.
- Removal occurs only after the deprecation period and zero old-client traffic.
