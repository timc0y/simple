Here is the Simple analysis and proposed implementation plan.

---

## Simple: Renaming a persisted field and its public API representation

### Reality

| Fact | Value |
|---|---|
| Consumers | External API clients with published SDKs |
| Retained state | Production customer records |
| Commitment | 90-day deprecation window |
| Ordinary path | Service's existing schema migration mechanism |
| Removal trigger | Deprecation period ends AND old-client traffic reaches zero |

### Obligation

Both old and new clients must work during the transition. Customer data must survive. The published API contract is preserved through a bounded adapter with an exit condition.

### Smallest honest design

**Three layers, three phases, one exit condition.**

#### Layer 1 — Storage (dual-column migration)

1. Add a new column with the desired name (e.g. `new_field`).
2. Backfill existing rows: `new_field = old_field`.
3. Write to **both** columns on every write.
4. Read from `new_field` for new-path logic.
5. After deprecation ends and old traffic is zero, drop `old_field`.

This uses the existing migration mechanism (ordinary path). No dual writes to different systems — just two columns in the same table.

#### Layer 2 — API (single bounded adapter)

One adapter maps between the external representation and the internal one:

```
External request  →  adapter translates old_name → new_field  →  service logic
Service response  →  adapter translates new_field → old_name  →  external response
```

- **Inbound:** Accept both `old_name` and `new_name`. If only `old_name` is present, treat it as the current value. If `new_name` is present, prefer it. Reject conflicting values.
- **Outbound:** Always emit **both** `old_name` and `new_name` with the same value during the deprecation period. This means old clients see their expected field, and new clients see the new name.
- The adapter is the single place that knows about the rename. No other service code changes its interface.

#### Layer 3 — Deprecation lifecycle

| Phase | What happens | Duration |
|---|---|---|
| **Deploy** | Add column, backfill, dual-write, enable adapter (both names in responses) | Day 0 |
| **Deprecate** | Emit deprecation header/warning to callers still using `old_name`. Monitor usage. | Days 1–90 |
| **Remove** | When day 90 passes AND old-name traffic is zero: stop emitting `old_name` in responses, drop old column via migration. | Day 90+ |

### Proof (independent verification)

1. **Stored data:** Query rows to confirm `old_field` and `new_field` are identical after backfill.
2. **Both API representations:** Call the endpoint requesting `old_name` and `new_name` separately — both return correct data. Send both simultaneously — no conflict error.
3. **Rollback:** Revert the adapter and migration: `old_field` is still the source of truth until backfill completes; rollback is safe at any point before column drop.
4. **Removal criteria:** A simple query or dashboard tracking `old_name` usage in request logs. Remove only when count is zero for a sustained window.

### What this avoids

- No versioned API (`/v1`, `/v2`) — one endpoint, one adapter.
- No feature flags — the adapter is always on during the window.
- No shadow writes or dual databases — one table, two columns.
- No abstract compatibility layer — one concrete adapter with a named exit condition.

### Reconsider when

The 90-day window expires and old-client traffic reaches zero. At that point, remove the adapter and drop the old column.
