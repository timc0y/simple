Now applying the Simple design mode to this case.

---

## Proposed Implementation: Rename a Persisted Field and Its Public API

### 1. Obligations (from `SIMPLE.md`)

| Fact | Consequence |
|---|---|
| External API consumers with published clients | Old field name must remain accepted and returned during deprecation |
| Retained production data | Existing stored records must not break; migration must be reversible or at least verifiable |
| 90-day deprecation promise | Two API representations must coexist for 90 days, then old one is removed |
| Schema changes use the existing migration mechanism | Use whatever migration tooling the service already owns |

### 2. Required Outcome

The persisted column is renamed. Both old and new field names are served by the API. Old-name writes are silently mapped to the new column. After 90 days, old-name support is removed.

### 3. Ordinary Path

Schema migration is already handled by the service's migration framework. API versioning or field aliasing is handled by the existing serializer layer (or equivalent). No new owner, no new dependency, no new workflow.

### 4. Missing Capability

One bounded adapter: a translation layer in the API/serializer that accepts both field names on input, returns both on output, and maps them to the single new column in the database. This is the only new code.

### 5. What Must Be Preserved / What May Be Replaced

- **Preserved:** Old field name accepted on write, old field name present in read responses, 90-day window honored.
- **May replace:** Direct column name references in application code (update them to the new name). The old field name in the database schema itself (via migration).

### 6. Design (Smallest Honest Path)

```
Step 1 — Schema migration (expand)
  Add the new column. Do NOT drop the old column yet.
  Backfill existing rows: old_col → new_col.
  The service now has both columns; reads/writes use old column during transition.

Step 2 — API adapter
  In the serializer / API handler:
  - Accept both old_field and new_field on input; map to new column.
  - Return both old_field and new_field on output (value comes from new column).
  This is one bounded adapter with a clear exit condition (90-day removal).

Step 3 — Flip the write path
  Change application code to read/write the new column.
  Old column is now ignored on write; still returned on read from the adapter.

Step 4 — Schema migration (contract)
  After 90 days, when old-client traffic reaches zero:
  - Drop the old column from the schema.
  - Remove the adapter.
  - Old field name no longer accepted or returned.
```

### 7. What Does NOT Exist Yet (and must not be added)

- No feature flag, no shadow writes, no dual-write system.
- No new versioned API namespace.
- No new abstraction layer — the adapter is inline in the existing serializer.

### 8. Proof

| Check | How |
|---|---|
| Stored data | Query the new column after backfill; verify row count matches, no nulls in formerly populated rows |
| Old API representation | Send a request with the old field name; confirm it writes to the new column and the response includes both names |
| New API representation | Send a request with the new field name; confirm the same |
| Rollback | Revert the migration (drop new column, rename old back) if needed within the safety window; verify old clients resume normal operation |
| Removal criteria | After 90 days: old-name traffic = 0 in access logs; then drop old column and adapter |

### 9. Reconsider When

The 90-day deprecation period ends and old-client traffic reaches zero. At that point, the old column and adapter are removed; the codebase has one field name, one column, one path.

---

This is the smallest design that satisfies the present obligations: a two-phase migration with one bounded adapter, no new owners, no new abstractions, and a clear exit condition.
