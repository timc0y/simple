Use an additive migration and one temporary compatibility adapter.

- Add the new persisted field through the existing migration mechanism. Backfill it from the old field; keep the old field intact.
- During the 90-day window, treat the old stored field as the compatibility source of truth: new service code reads it and transactionally writes both fields. This keeps rollback to the previous service safe and prevents old clients or deployments from losing updates.
- At the API boundary, map each published representation to the same internal value:
  - old API representation accepts and returns the old field name;
  - new API representation accepts and returns the new field name.
  
  Use the service’s existing API-version/representation selection mechanism. Do not return both names in one representation unless that is already the documented compatibility convention.
- Centralize the temporary mapping and dual-write in the existing persistence/API serialization owners; callers should see one logical field, not choose columns or aliases.
- Verify:
  - migration/backfill preserves every stored value;
  - old and new API clients round-trip their respective names;
  - writes through either API remain visible through the other;
  - rolling back to the prior service still reads the current data.
- After 90 days, once old-client traffic is zero, remove the old API mapping and field, make the new field authoritative, and delete the dual-write path.

The unresolved repository fact is how clients select an API representation. The implementation should reuse that existing mechanism; inventing a parallel versioning route would add unnecessary compatibility surface.
