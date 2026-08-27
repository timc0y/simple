## Implementation Plan: Renaming a Persisted Field and Its Public API

### Obligations established

| Fact | Evidence |
|------|----------|
| External API consumers exist | Published API clients |
| Production data must survive | Customer records in persistent storage |
| Deprecation commitment | 90-day promise |
| Old and new clients must coexist | Current boundary statement |
| Schema changes have an ordinary path | Existing migration mechanism |

### Required outcome

Rename a field in persisted storage and its public API surface without breaking existing clients or losing data during the 90-day deprecation window.

### Smallest honest path

This case has **retained data** and **real old callers**. Per the compatibility guide, the correct approach is: **one bounded adapter with an exit condition**.

### Implementation

1. **Add the new column** (if relational) or field (if document) via the existing migration mechanism. Default it to the old field's value.

2. **Write adapter layer** at the API boundary:
   - Inbound (old clients sending old field name): map to new field before persistence.
   - Outbound (old clients expecting old field name): map from new field before response.
   - New clients use the new field name directly.

3. **Dual-write on mutation**: Write both old and new fields during the deprecation period. Read from the new field; fall back to old if new is null (handles in-flight old writes).

4. **Backfill existing data**: One migration pass to populate the new field from the old field for all retained records.

5. **Exit condition** (90-day removal criteria):
   - Old-client traffic reaches zero (observable via access logs).
   - No in-flight requests reference the old field name.
   - Remove adapter, dual-write, old column/field, and old API shape.
   - Verify: stored data uses only new field; API serves only new shape.

### Proof

- Stored data: verify every retained record has the new field populated.
- Both API representations: old field name returns correct data; new field name returns correct data.
- Rollback: if migration fails, old field remains the source of truth; new column can be dropped.
- Removal criteria: old-field traffic metric at zero for sustained period.

### What to preserve vs. replace

| Preserve | Replace (after 90 days) |
|----------|------------------------|
| Customer records | Old column/field |
| Published API contract (old shape) during deprecation | Dual-write logic |
| New field as source of truth | Adapter layer |

### Reconsider when

The deprecation period ends and old-client traffic reaches zero.
