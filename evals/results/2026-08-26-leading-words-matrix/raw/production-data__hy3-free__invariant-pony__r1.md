## Proposal: rename a persisted field and its public API representation

**Obligations from `SIMPLE.md`** (these are the only material facts): a production service, external published-API consumers, retained customer records, a promised **90-day deprecation**, during which **old and new clients must both work**, schema changes go through the **existing migration mechanism**, and proof must cover stored data, both API representations, rollback, and removal criteria.

This matches the compatibility pattern *"real old and new callers → one bounded adapter with an exit condition."*

### Design (smallest shape that honors those obligations)

**1. Persisted field — single migration (ordinary path).**
Rename the stored column/field via the service's existing migration mechanism. The migration copies-and-renames (never drops), includes a down-migration that restores the old name, and runs under backup + row-count verification + sampled value check. No second persisted copy is kept — dual storage would be unrented state.

**2. Public API — one bounded adapter, not two versions.**
A single serialization translator at the API boundary, gated by the 90-day window:
- **Reads:** emit **both** the old and new field names. This lets old and new clients work with zero client branching — the smallest way to satisfy "both must work."
- **Writes:** accept **either** name; normalize to the new canonical name before persistence.

This is the only compatibility layer; it carries a named exit condition (below), so it is not permanent.

**3. Proof (per `SIMPLE.md`).**
- *Stored data:* row/value diff before vs. after migration; down-migration restores exactly.
- *Both API representations:* integration tests assert (a) old-name request accepted and old-name response emitted, (b) new-name path likewise.
- *Rollback:* migration down + adapter gated off restores prior contract.
- *Removal criteria:* adapter and old-name acceptance deleted once **90 days elapsed AND old-client traffic = 0**.

**4. Removal trigger (reconsider condition).**
Emit a metric on old-name usage so "old-client traffic reaches zero" is observable, not guessed. At that point delete the adapter, stop emitting the old name, and update client docs.

### What this avoids (YAGNI / Chesterton's fence)
- No API versioning, feature flag, shadow system, or permanent dual-write layer.
- No second persisted column — the migration is the single source of truth; the API adapter owns the translation only.
- No removal before the stated exit condition.

### Open choice for you
Reads currently propose **emitting both** names (simplest, no client branching). The alternative is content-negotiation (emit only the name the caller used), which is slightly leaner on payload but needs caller detection. I'd recommend "emit both" unless payload size is a stated concern. Want me to go with "emit both," or prefer negotiation?
