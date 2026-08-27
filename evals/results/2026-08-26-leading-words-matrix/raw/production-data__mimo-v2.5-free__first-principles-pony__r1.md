Let me understand the codebase and reference materials to properly design this.This is a design task with no actual codebase to inspect — a hypothetical scenario grounded by the SIMPLE.md. Let me apply the Simple design method.

---

## Implementation Plan: Renaming a Persisted Field and Its Public API

### Obligations (from SIMPLE.md)

| Fact | Obligation |
|---|---|
| External API consumers | Old field name must work for 90 days |
| Retained customer records | Stored data survives migration |
| 90-day deprecation | Time-bounded dual support with exit condition |
| Existing migration mechanism | Reuse the ordinary path |

### Design

**Two changes, one owner, bounded adapter.**

**1. Database migration (storage)**

Add a migration that renames the column. The existing migration mechanism is the ordinary path — reuse it.

- Rename `old_name` → `new_name` in the table.
- No data loss; the data is identical, only the identifier changes.
- Rollback: rename back. Prove: `SELECT` confirms row counts and values match pre-migration.

**2. API adapter (public representation)**

The API must accept and return both names during the deprecation window.

- Accept `old_name` in incoming requests and map it to `new_name` internally.
- Return `new_name` in responses. Optionally include `old_name` as a deprecated alias for the first 90 days if clients need a gentler transition.
- Reject requests that send both `old_name` and `new_name` simultaneously (ambiguous input).

This is one bounded adapter with a clear exit condition: delete the `old_name` mapping after 90 days.

**3. Deprecation lifecycle**

| Time | Action |
|---|---|
| Day 0 | Deploy migration + adapter. Log usage of `old_name` field. |
| Day 0–90 | Monitor `old_name` usage. Warn consumers via response headers or changelog. |
| Day 90+ | Remove adapter. Drop any temporary alias columns. Old-name requests become errors. |

**4. Proof**

- Stored data: compare row values before/after migration.
- API representations: verify both `old_name` and `new_name` are accepted; verify `new_name` is returned.
- Rollback: run reverse migration, confirm old code works.
- Removal criteria: when `old_name` usage hits zero (or 90 days pass), remove the adapter.

### What this does NOT do

- No feature flags, shadow writes, or dual-write logic — the data is the same, only the name changes.
- No new dependencies or abstractions — the adapter is a thin mapping layer.
- No versioned API — one adapter, one exit date.

---

### Summary

The smallest design: rename the column via the existing migration mechanism, add a thin API adapter that maps the old name to the new name, and delete the adapter after 90 days. One owner (the service), one bounded adapter, one exit condition.
