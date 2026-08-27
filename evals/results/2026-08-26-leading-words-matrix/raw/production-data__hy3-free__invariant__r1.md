The SIMPLE.md is a case study with no real code. Let me explore the actual codebase to ground the proposal.This is a Simple skill exercise with a synthetic case (no real app code). Let me load the relevant skill references to ground the proposal.I've read the case. There's no application codebase here—this is a Simple-method exercise on the synthetic `SIMPLE.md` scenario. Applying Simple's design method and the `compatibility.md` ladder, here is the proposal.

## Reality (from `SIMPLE.md`)
- Production service; **external published API clients** depend on the public representation.
- **Retained customer records** must survive any change.
- A **90-day deprecation promise** is a real compatibility commitment.
- **Old and new clients must both work during the transition.**
- Schema changes already have an **ordinary path: the service's existing migration mechanism.**

## Required outcome (stated without naming current code)
A single internal field, renamed, with no loss of customer data, and both the old and new public field names accepted/returned until the deprecation period ends.

## Smallest honest design
Two separate surfaces, two different obligations — do **not** bundle them into one "rename everything" change.

1. **Persisted field (internal, no external caller).** Use the *existing migration mechanism* to rename the storage column and backfill every row. Update all internal code to the new name in the same release. No compatibility layer is owed here — internal code is owned. (`compatibility.md`: "retained data but no old callers: migrate the data, not the interface.")

2. **Public API representation (external, 90-day promise).** Add **one bounded adapter at the API boundary only**, with an explicit exit condition:
   - **Request parsing:** accept both `oldKey` (deprecated) and `newKey`; both map to the single internal field. Reject only when both are present and conflict.
   - **Response serialization:** emit both keys during the deprecation window (new as primary, old as documented alias).
   - **Observability:** count requests/responses that use `oldKey`, so removal is evidence-based.
   - **Exit condition:** after 90 days *and* `oldKey` traffic = 0, delete the adapter and stop emitting `oldKey`. Record this as the removal criterion, not as a permanent dual-write.

The adapter reads/writes only the new internal field, so storage stays a single source of truth. This is the `compatibility.md` case "real old and new callers: one bounded adapter with an exit condition" — not a versioned API, not a shadow system.

## Proof (per `SIMPLE.md` "Proof")
- **Stored data:** confirm every migrated row carries the new field value; spot-check pre/post counts.
- **Both API representations:** call the endpoint with `newKey` and with `oldKey`; assert both succeed and both responses contain both keys.
- **Rollback:** the migration must have a down-step (reverse column rename + backfill); verify on a copy before production.
- **Removal criteria:** assert the metric exists and the deletion path is documented with the 90-day/zero-traffic gate.

## What is preserved vs replaced
- Preserved: customer data, the published API contract (old key) during the window, rollback capability.
- Replaced: the old internal field name (code + column); the old-key handling once the exit condition triggers.

## Flagged assumptions / one open decision
This case has no concrete codebase, so I assumed: the migration mechanism handles both column rename and backfill, and the API field is read *and* written. The one genuine choice worth your call: **rename the storage column in the same release as the API adapter** (simpler, one migration) versus deferring the storage rename until after old-client traffic hits zero (smaller blast radius per release). Simple favors the first because internal storage has no external caller and the migration path already exists — but tell me if you want the two released independently.

Want me to write this as a concrete plan file, or adjust the storage-timing decision first?
