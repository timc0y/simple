## Implementation proposal: rename persisted field + public API representation

**Grounded in SIMPLE.md obligations** — External published-API clients (old + new), retained customer records, a 90‑day deprecation promise, and an existing migration mechanism. Old and new clients must work during the transition.

### Decision
A direct rename would break the published contract during the deprecation window. The smallest honest path for *real old and new callers* (per `compatibility.md`) is **one bounded adapter at the API serialization boundary, with an explicit exit condition** — not dual writes, versioning, or shadow systems.

### What is preserved vs. replaced
- **Preserved during deprecation:** customer data and the published API contract. Old clients keep reading the old field name; new clients read the new name.
- **Replaced:** the internal column name and the canonical API key, once the window closes.

### Steps

1. **Persisted field (existing owner, ordinary path)**
   - Use the service's existing migration mechanism to rename the column. This is a rename, not drop‑recreate — data is preserved in place.
   - Write a reversible down‑migration that restores the old column name and data. No data loss on rollback.

2. **Public API representation (bounded adapter)**
   - Rename the internal field in code to the new name.
   - At the single serialization owner, emit the value under **both** the old and new keys during the deprecation period — old clients (`oldName`) and new clients (`newName`) both succeed with one source of truth.
   - This adapter is the only compatibility machinery; it is owned, temporary, and names its exit condition.

3. **Exit condition (removal criteria)**
   - Remove the old‑name emission when **both** hold: the 90‑day deprecation period has ended **and** old‑client traffic on `oldName` has reached zero.
   - Until then, the adapter stays. After removal, only `newName` is emitted.

4. **Rollback**
   - Revert the API code → old key is emitted again. Run the down‑migration → column restored. Customer data is untouched either way.

### Proof (independent surface)
- **Stored data:** query the renamed column confirms identical customer values post‑migration.
- **Both representations:** a request from an old‑client shape returns `oldName`; a new‑client shape returns `newName`; both carry the same value.
- **Rollback:** down‑migration + code revert restores prior state with no data change.
- **Removal criteria:** traffic monitor on `oldName` reaches zero after the 90‑day mark, triggering adapter deletion.

### Open facts to confirm before coding
- The actual persisted column name and public API key (used as placeholders above).
- The serialization layer that is the natural single owner of the field emission.
- Whether traffic on the old field name is already observable (needed to prove the exit condition).

**Reconsider when:** the deprecation period ends and old‑client traffic reaches zero — at which point the adapter is removed and the rename is complete.
