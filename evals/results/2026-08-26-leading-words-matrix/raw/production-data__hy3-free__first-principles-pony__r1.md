I'll start by reading the SIMPLE.md and the Simple skill.Let me explore the repository to ground the plan in facts.This is a scenario case. Let me read the case-specific files.This is a scenario case (no application code present), so the proposal is grounded only in the committed facts in `SIMPLE.md` and the Simple method. Here is the proposed implementation.

## Facts this plan must satisfy (from `SIMPLE.md`)
- Production service, external published API clients (real consumers).
- Retained customer records that must survive.
- A 90-day deprecation promise; old and new clients must both work during it.
- Schema changes go through the existing migration mechanism.
- Proof required for: stored data, both API representations, rollback, removal criteria.
- Reconsider/remove when the 90-day window ends and old-client traffic reaches zero.

## Invariant (stated without the current names)
The value ends up stored under the new persisted name and exposed on the API under the new key. For 90 days the same value is also reachable under the old key by old clients.

## Design — smallest honest path
The compatibility rule for "real old and new callers" is one bounded adapter with an exit condition. We avoid dual-writes and versions by **deferring the persisted rename to the cutover**, so the transition is purely an API-representation alias.

**Phase 0 — Alias at the API edge (deploy, start the clock).**
- No data migration. The persisted column keeps its old name.
- Add one bounded adapter in the serialization layer: reads emit both `newKey` (primary) and `oldKey` from the single stored field; writes accept either key and map to the same field.
- Add `deprecationEndsAt` (now + 90 days) and a kill-switch to drop `oldKey`.
- This is the only new machinery; it pays rent through the explicit 90-day commitment and the removal condition.

**Phase 1 — Monitor.**
- Track `oldKey` request volume. Cutover requires old-client traffic to reach zero.

**Phase 2 — Cutover (after 90 days and zero old traffic).**
- Migration via the existing mechanism: rename the persisted column `oldName → newName` (add new, backfill, drop old, or native rename).
- Remove the alias adapter; read/write only `newKey`. Remove the kill-switch and deprecation config.

## Preserve vs replace
- Preserve during window: customer data (untouched in Phase 0) and the published API contract for old clients.
- Replace at cutover: the old API key and the old persisted column name.

## Proof
- Stored data: during Phase 0, assert `stored value == value returned by both keys`; cutover leaves values identical.
- Both representations: contract test that reads/writes through `oldKey` and `newKey` observe and update the same value.
- Rollback: Phase 0 is code-only (redeploy prior version, nothing in data to undo). Phase 2 has a reverse migration.
- Removal criteria: cutover runs only when `now >= deprecationEndsAt` **and** old-client traffic == 0.

## Facts to confirm before coding
1. Does the public API key currently equal the persisted column name? (If other internal code references the DB name directly, it needs the same rename at cutover.)
2. Does the field appear in other published surfaces — webhooks, exports, webhooks — that must also gain the alias? `SIMPLE.md` only commits to the published API contract.
3. The name of the existing migration mechanism.

One open tradeoff: I chose to rename the persisted column at **cutover** rather than at deploy, to avoid a temporary dual-write. If you'd rather rename the DB early (so the new name is the source of truth immediately), the adapter would instead map `oldKey → newColumn` and we'd keep the old column in sync for rollback — more machinery, so I'd only do it if early DB rename is itself a requirement.
