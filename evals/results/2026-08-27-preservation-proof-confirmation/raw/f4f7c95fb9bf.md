## Proposed implementation

Rename the persisted field through the existing schema-migration mechanism, and keep compatibility at the API boundary for the promised 90-day period.

### Current reality

- Published clients use the old API field name.
- New clients need the new API field name.
- Customer records must retain their values.
- The service promises compatibility for 90 days.
- Schema changes already have an established migration path.

### Design

1. Add a reversible migration that renames the database field from `old_name` to `new_name`, preserving all values.
2. Update the service’s internal model and queries to use only `new_name`.
3. At the API boundary:
   - map `old_name` to `new_name` when reading legacy requests;
   - emit `old_name` for legacy clients;
   - emit `new_name` for the new API representation;
   - reject or define precedence for requests containing both names.
4. Use the service’s existing API-version or representation-negotiation mechanism to distinguish legacy and new clients. If none exists, that is the remaining design fact to establish before implementation.
5. Keep the compatibility mapping for 90 days. Do not maintain two persisted fields or add dual writes.

The API adapter owns compatibility; the renamed database field remains the single source of truth.

### Proof

Verify independently that:

- every stored value survived the migration;
- legacy requests and responses retain their original representation;
- new requests and responses use `new_name`;
- both representations produce the same underlying value;
- the migration can be rolled back using the existing recovery process;
- malformed requests and requests containing both names follow the defined validation rule.

Monitor legacy-field traffic during the transition.

### Removal

After 90 days, remove the legacy API mapping and its tests once old-client traffic is zero or the published deprecation commitment has otherwise been satisfied. The database and internal model should retain only `new_name`.
