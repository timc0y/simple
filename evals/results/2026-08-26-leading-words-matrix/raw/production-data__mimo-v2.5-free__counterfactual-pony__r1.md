Let me read the relevant references for this task — compatibility and refactoring — since it involves renaming a field with a deprecation period.Now I have the full picture. Here is the implementation proposal using Simple's design method.

---

## Plan: Rename a Persisted Field and Its Public API Representation

### Obligations (from repository facts)

- **Data**: Customer records are retained in production storage. The old field name is stored in persisted data.
- **API contract**: Published external clients reference the current field name. A 90-day deprecation promise is in force.
- **Transition**: Old and new clients must coexist for the duration.

### Design

**Smallest honest path** (per `references/compatibility.md`): Retained data **and** real old+new callers → **one bounded adapter with an exit condition.**

#### 1. Database layer — dual-column migration

Add the new column alongside the old. Backfill existing rows. Keep both columns written during the deprecation window.

- Create a migration that adds `<new_column>` to the persisted table.
- Backfill: `UPDATE table SET <new_column> = <old_column>` where `<new_column>` is null.
- Write path: every write sets **both** columns to the same value.
- Read path: the repository returns `<new_column>` as the canonical value.

#### 2. Internal domain model — rename at the boundary

Rename the field in the domain object / ORM model to the new name. The repository adapter is the only place that touches the old column. No other code references the old name.

#### 3. API layer — bounded adapter with exit condition

Expose **both** names in the public response during the deprecation period:

- Response serialization: always include the new field name as the primary key. Conditionally include the old field name as a deprecated alias, populated from the same value.
- Request deserialization: accept either name. If the old name is sent, treat it as equivalent to the new name.
- Deprecation header: include a `Deprecation` or `Sunset` header with the date 90 days from rollout.

**Exit condition**: After 90 days, remove the old alias from the response and the old-name acceptance from the request deserializer.

#### 4. What is preserved and what may be replaced

| Preserved | Replaced after 90 days |
|---|---|
| All customer data (now in both columns) | Old column and its migration |
| Old client requests (accepted via alias) | Old-name alias in API responses |
| New client requests (already using new name) | Dual-write logic in repository |

#### 5. Proof

- **Stored data**: Query production rows; confirm `<new_column>` is populated and matches `<old_column>`.
- **Old API representation**: Send request/response with old field name; confirm it works and returns data.
- **New API representation**: Send request/response with new field name; confirm it is the primary surface.
- **Rollback**: If migration fails, old column remains intact and is still the write target — no data loss.
- **Removal criteria**: After 90 days with zero old-name traffic (verified by access logs), drop the old column and remove the adapter.

#### 6. Removal (after 90 days)

- Migration: drop `<old_column>`.
- Remove dual-write from repository.
- Remove old-name alias from API serialization/deserialization.
- Remove deprecation header.
- Update API documentation.
