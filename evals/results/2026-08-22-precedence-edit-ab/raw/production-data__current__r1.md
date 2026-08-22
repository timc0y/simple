## Obligation (from SIMPLE.md)

- Consumers: published API clients already integrated against the current field name — real, not hypothetical.
- Retained state: existing customer records already stored under the old field name.
- Commitment: both the stored data and the published contract must keep working for 90 days.
- Ordinary path: the service's existing migration mechanism, not a new one.

This is the "real old and new callers" case from `references/compatibility.md`: one bounded adapter with an exit condition, not a version fork, not a permanent dual-write.

## Design

**Storage — migrate the data, not the schema twice.**
1. Add the new column via the existing migration mechanism (additive, backward-compatible).
2. Backfill it from the old column in that same migration (or a follow-up data migration if the table is large enough to need batching) — this is copy, not translate, since it's a rename.
3. Keep the old column in place, unindexed if it's no longer queried, until the deprecation window closes. Do not drop it now — the read side still needs it, and dropping it early is what a "removal criteria" step exists to gate.
4. Application code reads and writes only the new column going forward. The old column is copied on write (from the same request) only for as long as anything still reads it — since nothing but the API's old representation reads it, that's just the serializer, not a second write path in the domain logic.

**API — one bounded adapter, at the serialization boundary only.**
1. Response body includes both the new field name and the old field name, both reflecting the same underlying value. This lives in the serializer/presenter layer — the one owner of "what the wire looks like" — not duplicated across handlers.
2. Requests accept either field name on write; if a client sends the old name, map it to the new column at the same boundary. If both are somehow sent, the new name wins (it's the one being promoted).
3. Mark the old field deprecated in the API docs/schema (OpenAPI `deprecated: true`, changelog entry, sunset date = commitment date + 90 days). If the service has a mechanism for deprecation headers (`Sunset`, `Deprecation`) on responses, use it — that's the existing tool for this, not a new one.

**What's preserved / what's replaced**
- Preserved: every stored record's value, the old field name in both directions of the API, old clients' behavior unchanged.
- Replaced: the column and field name going forward; the old column becomes a read-only shadow of the new one for the deprecation window only.

## Proof (per SIMPLE.md's Proof line)

- **Stored data**: migration test — every existing row has matching old/new column values post-backfill; new writes populate both.
- **Both API representations**: contract test hitting the live endpoint — old client payload/response shape still validates; new client payload/response shape validates; a record written via one name reads back correctly via the other.
- **Rollback**: migration is reversible (new column can be dropped without touching the old one, since old column remains authoritative-by-copy throughout); confirm no code path exists that reads the new column without a value if rollback happens mid-window.
- **Removal criteria**: old-client traffic on the old field name reaches zero (metric to watch, not a guess) AND the 90 days have elapsed. Both conditions gate dropping the old column and the compatibility mapping in the serializer.

## Reconsideration

When old-client traffic hits zero and the 90-day window closes: remove the old column, the old-name mapping in the serializer, and the deprecation notice — in that order, each behind its own migration/PR so removal is independently reversible if traffic wasn't actually zero.
