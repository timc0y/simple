Here is the implementation proposal, structured by the Simple design process.

---

## Rename a Persisted Field and Its Public API Representation

### Reality

- **Consumers**: Published API clients, potentially multiple versions in the field.
- **Retained data**: Customer records with the current field name in production storage.
- **Compatibility obligation**: 90-day deprecation window; old clients must keep working.

### Required outcome

The field has a new name in the internal schema and the new API representation, while the old API representation continues to return the correct value under the old name for the duration of the deprecation period.

### Implementation

**Phase 1 — Dual-read layer (day 0)**

1. Add the new column to the database via the service's existing migration mechanism. Copy existing data (or rename the column, depending on engine support; both are schema changes on the ordinary path).
2. In the data-access layer, write the new column as the source of truth. Read both columns when constructing API responses.
3. In the API response layer, return **both** the old name (with the persisted value) and the new name (same value) in every response. This satisfies old and new clients simultaneously.
4. Mark the old API field as deprecated in documentation and, if the API supports it, in response headers (e.g., `Deprecation: true`, `Sunset: <90-day date>`).

**Phase 2 — Ingress migration (days 1–90)**

5. Accept writes on **either** the old or the new field name. When the old name is received, write the value to the new column and populate the old column for backward compatibility (single-writer, one source of truth: the new column).
6. Log or count writes arriving on the old field name to track migration progress.

**Phase 3 — Removal (day 90+)**

7. Confirm old-client traffic has reached zero (or an agreed threshold) via the logged counts.
8. Remove the old field from API responses.
9. Drop the old column via the existing migration mechanism.
10. Remove the dual-read/write adapter code.

### What must be preserved

| Obligation | How |
|---|---|
| Customer data | New column is the source of truth; old column is a read-only mirror during transition |
| Old API contract | Old field name returned in responses for 90 days |
| Rollback | Old column stays populated; reverting the service restore's the old behaviour without data loss |

### What may be replaced

- The old column and its read/write path, once the deprecation window closes and traffic confirms zero old-client usage.

### Independent proof

1. **Stored data**: Query the database; both columns contain identical values.
2. **Old API representation**: Call the API; response includes the old field name with the correct value.
3. **New API representation**: Same call; response includes the new field name with the same value.
4. **Rollback**: Revert the service; old field name still works, no data loss.
5. **Removal criteria**: Dashboard or query showing old-field-name write count = 0 for a sustained period.

### Reconsider when

The deprecation period ends and old-client traffic reaches zero. Until then, the dual-column, dual-response adapter is the smallest design that satisfies the stated obligations.
