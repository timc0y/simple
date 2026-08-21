# Renaming a persisted field and its API representation

## Facts that drive this design (from SIMPLE.md)

- This is a production service with external consumers who hold published API clients — the contract can't break during the transition.
- The persisted data is retained customer records — no destructive change without a safe path back.
- There is a 90-day deprecation promise, and the current boundary requires old and new clients to keep working through it.
- Schema changes go through the service's existing migration mechanism — nothing bespoke.
- The only condition that justifies removing the old name is: the 90 days have passed **and** old-client traffic has reached zero.

That rules out a single atomic rename. The smallest design that satisfies "old and new clients both work" is an **expand → migrate → contract** sequence, gated by evidence rather than a calendar alone.

## Phase 1 — Expand (add the new name, don't touch the old one)

1. Add the new column/field via the existing migration mechanism, alongside the existing one. Do not drop or rename the old column in this step.
2. Backfill the new column from the old column for existing records.
3. Make writes update both columns (dual write) so the two stay in sync from this point forward, regardless of which write path is used.
4. Add the new field name to the API's output alongside the old one (dual read/dual representation): responses include both `old_name` and `new_name` carrying the same value. Accept the new name on input in addition to the old one.

At the end of this phase, old clients see no change, and new clients can start using the new name immediately.

## Phase 2 — Publish and monitor

1. Document the new field name as the go-forward name; mark the old name as deprecated in the API docs/changelog, stating the 90-day removal timeline.
2. Instrument which name each request actually uses (read and write), so "old-client traffic" is a measured fact, not an assumption. This is the evidence the removal decision depends on.
3. Leave dual write and dual read running for the full deprecation window. Nothing about storage or the contract changes again until the removal criteria are met.

## Phase 3 — Contract (only when removal criteria are met)

Per the Reconsider condition, only proceed here when **both** are true: the 90-day period has elapsed, and measured old-client traffic (old field name, in either direction) is zero.

1. Stop dual write; write only the new column.
2. Drop the old field from API output and input handling.
3. Remove the old column via the existing migration mechanism.

If either condition isn't met at the 90-day mark, extend monitoring rather than removing — the deprecation promise is about client behavior, not just elapsed time.

## Rollback

Because dual write/dual read run through the entire deprecation window, rollback during Phases 1–2 is a config/deploy revert: stop serving the new representation, keep writing both columns, no data is lost since both columns already hold the same value. Rollback stops being cheap only after Phase 3 drops the old column — which is exactly why Phase 3 is gated on measured zero old-client traffic rather than attempted early.

## Proof (mapped to this repo's Proof section)

- **Stored data**: after backfill and during dual write, assert old and new columns are equal for all records (migration test + ongoing consistency check).
- **Both API representations**: contract tests that old clients (requesting/receiving `old_name`) and new clients (`new_name`) both get correct, matching values throughout Phases 1–2.
- **Rollback**: a rehearsed revert of the API-facing change (feature flag or deploy revert) with dual write still active, confirming no data loss and old-client behavior is unchanged.
- **Removal criteria**: before running Phase 3, show the measurement evidence — 90 days elapsed and old-field traffic at zero — as the explicit gate, not a date on a calendar alone.
