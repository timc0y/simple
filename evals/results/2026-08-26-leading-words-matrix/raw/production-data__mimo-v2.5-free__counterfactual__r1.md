Now let me explore the codebase to understand the current field, its persistence, and the public API.This is a design-mode task with no codebase to inspect. The SIMPLE.md establishes the constraints. Let me apply the Simple design method.

## Implementation Proposal: Renaming a Persisted Field and Its Public API

### Obligations (from SIMPLE.md)

- External API consumers depend on the current field name in the published contract.
- Production customer records store the old field name in the database.
- 90-day deprecation window: old clients must continue working.
- Schema changes follow the service's existing migration mechanism.

### Design

**One bounded adapter with an exit condition.** The compatibility guide selects this path because there are real old callers (published API clients) and retained state (customer records).

**Database layer:**
1. Write a migration that adds a new column with the target name. Copy existing data from the old column. Leave the old column in place — do not drop it yet.
2. The service writes to both columns during the deprecation period. Reads prefer the new column, falling back to the old column if null (handles in-flight rows from old writes).

**API layer:**
3. The public API response serialises the new field name. Include the old field name as an alias in the response so existing clients that parse it continue to work.
4. Accept the old field name in incoming requests (input mapping) for the duration of the deprecation window.

**Removal criteria (exit condition):**
5. After 90 days, confirm old-client traffic is zero via access logs.
6. Drop the old column in a follow-up migration. Remove the alias from the serialiser. This is one atomic removal — no lingering adapters.

### Proof

- Verify stored data: migration copies all rows, new column matches old column.
- Verify both API representations: new name is primary; old name is present in response.
- Verify rollback: old column is untouched, so reverting the service code restores old behaviour without a data migration.
- Verify removal criteria: traffic logs show zero old-client hits after the deprecation window.

### What this does not create

No versioned APIs, no dual writes to separate stores, no shadow systems, no feature flags. The adapter is bounded by the 90-day exit condition and removable in a single commit.

---

Want me to adjust this for a specific field name, schema, or service stack?
