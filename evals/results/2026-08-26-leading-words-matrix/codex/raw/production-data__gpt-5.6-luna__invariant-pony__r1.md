## Proposed implementation

Treat the new name as canonical internally. Keep compatibility only at the API boundary for the promised 90 days.

1. Add a schema migration using the existing migration mechanism that renames the persisted field in place. Preserve its type, nullability, indexes, constraints, and values. Do not create a second stored field or dual-write path.

2. Update the existing persistence owner and domain code to use the new field name.

3. Add one bounded API adapter:

   - Accept the old and new request names.
   - Normalize either name to the canonical internal field.
   - Serialize the old name for old API clients and the new name for new clients.
   - Define precedence or reject requests that provide both names.

   The adapter must use the service’s existing API-version or representation-selection mechanism. If none exists, that mechanism is the remaining design decision; inferring client age from payloads would be ambiguous.

4. Mark the old API name deprecated and document the removal date.

5. Verify independently:

   - Migration preserves every stored value.
   - New clients read and write the new representation.
   - Old clients continue to read and write the old representation.
   - Mixed-version traffic behaves consistently.
   - Rollback restores the previous application and schema state.
   - Migration reruns safely according to the repository’s migration rules.

6. After 90 days, confirm old-client traffic is zero, then remove the old API alias, compatibility serialization, deprecation documentation, and related tests. Retain only the renamed persisted field.

The essential shape is:

```text
old/new API representation
          ↓
bounded compatibility adapter
          ↓
canonical new domain field
          ↓
renamed persisted field
```

This preserves customer data and the published contract without introducing duplicate storage or a permanent compatibility layer.
