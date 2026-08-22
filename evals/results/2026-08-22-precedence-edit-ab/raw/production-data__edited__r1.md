## Proposal: rename the field, persisted and public

**Obligation (from SIMPLE.md):** external clients call this API today; the deprecation promise gives old and new clients 90 days of simultaneous support; the record is retained customer data. So this isn't a pure rename — it's a rename plus one bounded compatibility window, and it ends on a stated date.

### What actually needs an adapter

The database column and the API field are two different obligations:

- **Persisted column** — nothing external addresses it directly. No consumer or contract depends on the column's *name*, only on the data surviving. So this side is an ordinary schema migration, done through the service's existing migration mechanism, same as any other rename. No compatibility machinery needed here.
- **Public API field** — this is what published clients actually call by name. This is the one place with real old and new callers, so it's the one place that earns the adapter compatibility.md calls for: *"Real old and new callers: use one bounded adapter with an exit condition."*

### Design

1. **Migrate the column** via the existing mechanism's normal rename path (expand/contract if that's how the service already does zero-downtime renames — don't invent a new pattern for this). One column, one name, afterward. This is internal, so it can move in a single change once serialization no longer depends on the column name directly.
2. **Add one serialization adapter at the API boundary**, not a new API version:
   - Responses include both the old and new field names, both reflecting the same persisted value.
   - Requests accept either field name; if both are present, that's a client error (ambiguous), not silently resolved.
   - No dual writes, no shadow column, no feature flag — the adapter is a mapping at serialize/deserialize time over the one column that now exists.
3. **Exit condition, stated now, not discovered later:** the old name is removed from responses and no longer accepted on requests when the 90-day deprecation period ends *and* traffic monitoring shows zero requests using the old name — matching SIMPLE.md's "Reconsider when." If the period ends but old-name traffic is still nonzero, that's a signal to escalate to the client, not to quietly extend the adapter indefinitely.

### Preserve

- Customer data survives the column migration — verified, not assumed.
- Both the old and new API contracts are honored for the full 90 days, not best-effort.

### Proof

- **Stored data:** before/after row counts and value spot-checks across the migration; a reversible down-migration for rollback.
- **Both API representations:** contract tests that write via the old field name and read via the new one, and vice versa, confirming they resolve to the same stored value.
- **Rollback:** the migration's down path restores the old column name without data loss; the serialization adapter has no state, so rolling it back is just reverting the code.
- **Removal criteria:** explicit — date passed AND old-field-name request volume at zero, checked before deleting the adapter and the old name from responses.

### What this avoids

No API version bump, no permanent dual-name support, no feature flag, no second source of truth for the value. One migration, one bounded adapter, one dated removal — sized to the 90-day commitment that actually exists, not to a hypothetical longer one.
