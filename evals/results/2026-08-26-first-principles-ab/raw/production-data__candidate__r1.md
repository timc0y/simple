## Proposal: rename a persisted field and its API representation

**Obligations (from SIMPLE.md):** external clients hold published API contracts against this field; the underlying rows are retained customer data; there's a 90-day deprecation promise; both old and new clients must keep working through that window; schema changes go through the existing migration mechanism.

**Ordinary path:** the existing migration mechanism already owns schema changes — reuse it rather than inventing a parallel one. Per `compatibility.md`, this is the "real old and new callers" case, which calls for **one bounded adapter with an exit condition** — not dual writes, versioned endpoints, or feature flags.

### Where the adapter belongs

The database has one internal writer/reader; nothing in the case facts says other internal consumers read the column by name. So the storage layer doesn't need to carry two names — only the **API boundary** has real old/new callers. Keep a single source of truth in storage and put the compatibility shim only at serialization.

### Implementation

**1. Storage — expand/contract, via the existing migration tool:**
- *Expand:* add the new column; backfill it from the old column in the same migration run.
- *Cutover:* switch application code to read/write the new column exclusively.
- *Contract (deferred):* drop the old column in a follow-up migration, gated on the removal criteria below.

**2. API — one bounded name adapter, sourced from the single new column:**
- *Responses:* emit both the old and new field names for the duration of the 90 days; mark the old name deprecated.
- *Requests:* accept either field name, mapped onto the same column; if the client is misbehaving and sends both, the new name wins.
- No new endpoint version, no separate stored copy — this is a name translation at the edge, not a second contract.

**3. Rollback:**
- The expand step is additive, so a deploy rollback before cutover loses nothing.
- Don't drop the old column until after cutover has been verified in production, so reverting the app deploy can still fall back to the old column if needed.

**4. Removal criteria (matches SIMPLE.md's "Reconsider when"):**
- Track which field name inbound requests use.
- Remove the old name from the API, and drop the old column, only once **both** hold: the 90-day promise period has elapsed, **and** old-name traffic has been at zero for a defined window (e.g., 7 consecutive days).

### Proof (per SIMPLE.md)

- **Stored data:** migration verification — row counts and backfilled values match the old column before cutover, no nulls introduced.
- **Both API representations:** contract tests exercising the endpoint under the old field name and the new field name, for both read and write, throughout the transition window.
- **Rollback:** verify the app can be reverted post-expand without data loss (old column still present and correct until contract).
- **Removal:** verify via telemetry that old-name traffic is zero before the contract migration ships.

This keeps exactly one adapter (API field-name translation), one migration mechanism, one source of truth in storage, and a concrete, evidence-based trigger for deleting the compatibility path — nothing added for hypothetical future consumers.
