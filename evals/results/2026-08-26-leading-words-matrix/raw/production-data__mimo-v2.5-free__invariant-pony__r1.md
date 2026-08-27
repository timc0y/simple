Based on the SIMPLE.md constraints, here is the proposed implementation using Simple's design mode:

---

## Design: Rename Persisted Field and Public API Representation

### Obligations Established

- **External consumers**: Published API clients (old and new)
- **Retained data**: Customer records in production
- **Commitment**: 90-day deprecation period
- **Invariant**: Both old and new clients must work during transition

### Required Outcome

Rename a persisted field (and its public API name) while preserving:
1. Stored customer data
2. The published API contract during the deprecation period

### Proposed Implementation: Dual-Column Adapter

**Phase 1: Add new column** (Day 0)

1. Add a new database column with the new name
2. Write both old and new columns on every write
3. Serve both old and new names in API responses (dual representation)
4. Read from old column; use new column as source of truth once populated

**Phase 2: Backfill** (Day 0-1)

1. Migrate existing rows: copy old column → new column
2. Verify row counts and sample data match

**Phase 3: Read from new column** (Day 1-2)

1. Switch reads to new column
2. Continue writing both columns
3. Monitor for inconsistencies

**Phase 4: Deprecation window** (Day 2-90)

1. Old API name returns data from new column, aliased back to old name
2. New API name returns data directly
3. Log usage of old name; track decline to zero

**Phase 5: Remove old path** (Day 90+)

1. Drop old column from database
2. Remove old name from API responses
3. Remove adapter logic

### Proof

- Verify stored data survives migration
- Verify both API representations return correct data
- Verify rollback by re-pointing reads to old column
- Verify removal criteria: old-client traffic = 0 for 30 consecutive days

### What This Does NOT Do

- No feature flags
- No dual writes to separate systems
- No new abstractions or services
- No permanent adapters

The ordinary path (existing migration mechanism) handles the schema change. One bounded adapter handles the API compatibility. Exit condition is explicit.
