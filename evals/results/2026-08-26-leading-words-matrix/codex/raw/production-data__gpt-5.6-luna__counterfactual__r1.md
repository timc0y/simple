Use the existing migration mechanism and keep one canonical internal name.

Assume:

- persisted field: `old_field` → `new_field`
- API property: `oldField` → `newField`

Implementation:

1. Add a reversible schema migration that renames `old_field` to `new_field`. Preserve type, constraints, indexes, defaults, and nullability.
2. Update the domain model and internal code to use only `new_field`.
3. Add one API-boundary compatibility adapter:
   - accept both `oldField` and `newField` in requests;
   - reject requests that provide conflicting values;
   - serialize `newField` for new clients and `oldField` for legacy clients using the API’s existing version or representation-negotiation mechanism.
4. Mark `oldField` deprecated and record usage of the old representation. Do not create a second stored source of truth or permanent dual-write path.
5. Make rollback explicit: restore the application version and reverse the schema migration, or use the existing migration system’s tested rollback procedure.

Prove it through the public API and the database independently:

- old and new clients can read and write the same customer record;
- stored records contain `new_field` with no data loss;
- conflicting aliases are rejected deterministically;
- rollback restores the old application and schema;
- migration works on representative production-shaped data.

After 90 days, remove the old API adapter only when old-client traffic is zero or the deprecation commitment has otherwise been satisfied. Then remove the old serializer/parser tests and migration rollback support only according to the repository’s normal migration policy.

If the API has no existing way to distinguish legacy and new representations, establish that fact before implementation. Do not add a new API version solely for this rename without confirming that additive fields are unsafe for existing clients.
