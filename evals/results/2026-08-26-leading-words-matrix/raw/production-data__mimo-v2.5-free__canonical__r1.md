Now I have all the context. Let me apply the Simple design process.

---

## Simple Design: Renaming a Persisted Field and Its Public API

### Reality

| Fact | Source |
|---|---|
| Production service, external API consumers | SIMPLE.md |
| Published API clients exist | SIMPLE.md |
| Retained customer records in production | SIMPLE.md |
| 90-day deprecation commitment | SIMPLE.md |
| Schema changes use the service's existing migration mechanism | SIMPLE.md |

No hypothetical obligations. The obligations are concrete: preserve data and the old API surface for 90 days.

### Required Invariant

A persisted field must change its name in both storage and the public API, without breaking existing clients or losing data, for exactly 90 days.

### Design

**Smallest path per compatibility.md:** "Real old and new callers: use one bounded adapter with an exit condition."

The implementation has three parts, each owned by the existing service:

**1. Storage migration (existing migration mechanism)**

- Add a new column with the target name.
- Copy all rows from the old column to the new column.
- Set a nullable default so new writes populate both columns during transition.
- This is a backward-compatible schema change: the old column still exists and is still readable.

**2. API adapter (bounded, with exit condition)**

The API layer becomes the bounded adapter:

- **Reads:** Return the new field name. Optionally continue to include the old field name as a deprecated alias pointing to the same value during the 90-day window.
- **Writes:** Accept both the old and new field names. If the old name is present, map it to the new column. If both are present, the new name wins (explicit preference).
- **Exit condition:** After 90 days and zero old-client traffic, remove the old-name acceptance path and the alias.

This adapter has exactly one owner (the API layer), one contract (accept old and new names), and one exit condition (90 days + zero traffic).

**3. Cleanup (scheduled, time-bound)**

After the deprecation period ends and old-client traffic reaches zero:

- Drop the old column via the existing migration mechanism.
- Remove the old-name acceptance path from the API adapter.
- Remove the deprecated alias from responses.

### What is preserved, what is replaced

| Preserved | Replaced |
|---|---|
| All customer data (values survive in new column) | Field name in storage |
| Old API contract for 90 days | Public API field name |
| Existing migration mechanism as the owner of schema changes | — |

### What is NOT introduced

- No feature flags, shadow systems, or dual writes.
- No new abstraction layer or versioning scheme.
- No separate compatibility service.
- No new dependency.

### Proof

1. Verify stored data: all rows have the new column populated with the old column's values.
2. Verify old API representation: old field name still accepted and mapped correctly.
3. Verify new API representation: new field name is the primary surface.
4. Verify rollback: the old column remains readable; reverting the API adapter restores old-name-only behaviour without data loss.
5. Verify removal criteria: 90 days elapsed, old-name traffic is zero, old column is droppable.

### Reconsider when

The deprecation period ends and old-client traffic reaches zero. That is the single exit point for the adapter and the cleanup trigger.
