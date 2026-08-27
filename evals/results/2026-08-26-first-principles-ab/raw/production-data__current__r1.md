I don't have write permission for `answer.md`, so here's the proposal directly.

## Rename a persisted field and its public API representation

**Obligation (from SIMPLE.md):** real old and new API callers exist during a promised 90-day deprecation window, retained customer records must survive intact, and schema changes already have an ordinary path — the existing migration mechanism. This is the "real old and new callers" case in Simple's compatibility table: **one bounded adapter with an exit condition**, not a versioned API, dual-write system, or permanent alias.

### Storage — expand-contract via the existing migration mechanism
1. **Expand**: add the new column through the existing migration mechanism, backfill it from the old column, and dual-write both columns from the application until every instance runs the new code.
2. **Cut over**: switch application reads to the new column once dual-write is verified consistent.
3. **Contract**: after the 90-day window ends and old-client traffic is zero, drop the old column in its own migration.

No new data-access abstraction — this is the standard expand-contract shape the migration mechanism already supports, and it keeps rollback possible (old column stays authoritative-if-needed until cutover is verified).

### API — one bounded adapter at the serialization boundary
- Internally, code reads/writes only the new field name; the old name never leaks past one translation point.
- **Inbound**: accept either field name; if both are present and disagree, reject the request rather than silently resolving it.
- **Outbound**: emit both field names in responses for the deprecation period, so old clients work unmodified and new clients can adopt immediately.

### Exit condition
When the 90-day period ends **and** old-field-name traffic is verified at zero: remove the adapter, drop the old column if not already dropped, and remove old-name references from docs. Log/monitor old-name traffic so "zero" is a verified fact on day 90, not an assumption.

### Proof
- **Stored data**: migration test confirms every row backfills and the two columns agree before cutover.
- **Both API representations**: integration tests round-trip via old and new field names during the transition.
- **Rollback**: expand step can be rolled back with no data loss before contract runs.
- **Removal criteria**: adapter/old column only removed once the 90-day clock has elapsed *and* monitored old-name traffic is zero.

**Deliberately avoided:** API versioning for a single field rename, indefinite dual-name support, and any parallel data store or shadow-write path — expand-contract plus one bounded adapter fully covers the obligation.
