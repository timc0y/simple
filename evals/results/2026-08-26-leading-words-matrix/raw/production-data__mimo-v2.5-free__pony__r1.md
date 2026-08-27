Based on the case's SIMPLE.md, here's the implementation proposal:

---

## Design

**Obligation:** Rename a persisted field while honoring a 90-day deprecation commitment to published API clients. Customer data and the old API contract must survive the transition.

**Ordinary path:** The service already has a schema migration mechanism for data changes and a published API contract.

**Smallest honest design:**

1. **Add a migration** to rename the column in storage, preserving the data.
2. **Add a dual-read adapter** at the API boundary: accept both old and new field names in requests, emit both in responses for the deprecation period.
3. **Record the exit condition:** after 90 days, when old-client traffic reaches zero, remove the old field name from the adapter and collapse to the new name only.

**What is preserved:** Customer data, the old API representation, and the migration mechanism.  
**What is replaced:** The column name in storage and the primary API field name.  
**What is added:** A bounded adapter with a time-based exit condition.

**Proof:** Verify stored data reflects the new name, both API representations return correct data, rollback restores the old name, and the removal criteria (90-day window + zero old-client traffic) can be checked.

**Reconsider when:** The deprecation period ends and old-client traffic reaches zero.

---

This follows the compatibility reference's guidance: real old and new callers exist, so use one bounded adapter with an exit condition. No versions, dual writes, or feature flags are needed—just the migration, the adapter, and the removal plan.

Shall I proceed with implementation, or would you like to adjust any part of this plan?
