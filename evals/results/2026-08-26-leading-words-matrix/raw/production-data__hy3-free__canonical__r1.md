This is a pure reasoning case (the repo holds only `SIMPLE.md`, the prompt, and the skill), so I'll apply Simple's design method to the facts in `SIMPLE.md`.

## Facts (from `SIMPLE.md`)

- Production service; **external published API clients** exist. (`SIMPLE.md:5-6`)
- **Retained customer records** persist. (`SIMPLE.md:7`)
- A **90-day deprecation promise** is an explicit commitment. (`SIMPLE.md:8`)
- Must preserve **customer data and the published API contract** during the window. (`SIMPLE.md:12`)
- **Old and new clients must both work** during the transition. (`SIMPLE.md:16`)
- Schema changes go through the **existing migration mechanism**. (`SIMPLE.md:20`)
- Proof = stored data, both API representations, rollback, removal criteria. (`SIMPLE.md:24`)
- Exit signal: deprecation ends **and** old-client traffic hits zero. (`SIMPLE.md:27`)

Per `references/compatibility.md`, this is the "real old and new callers" case → **one bounded adapter with an exit condition**.

## Proposed implementation

The rename spans two coupled surfaces that must stay in lockstep for 90 days: the persisted column and the public JSON key. Treat the **new name as canonical** everywhere internally; expose the old name only through a bounded adapter that has a defined removal date.

**1. Persistence — migration (ordinary path)**
- Up migration: add `new_field`, backfill from `old_field`, make `new_field` canonical.
- Keep `old_field` present (not dropped) for the window; it remains the rollback surface and the mirror target for old-client writes.
- Down migration: restore `old_field` from `new_field` (reversible, preserves data).
- Do **not** drop `old_field` in this migration.

**2. API — single bounded adapter (one owner, exit condition)**
- Responses emit **both** `oldField` and `newField` with the same value for the 90 days.
- Requests accept **either** key; normalize to `newField`.
- Dual-write within the service: every write updates `new_field` **and** mirrors to `old_field`, so old-client readers stay correct until they migrate. This dual write is temporary and bounded by the window — not a permanent fork or shadow system.
- No API versioning, feature flag, or second code path.

**3. Exit (reconsider when, `SIMPLE.md:27`)**
- After 90 days **and** old-client traffic = 0: stop emitting/accepting `oldField`, delete the adapter, and run a second migration that drops `old_field`.

**4. Proof (`SIMPLE.md:24`)**
- Stored data: assert `old_field == new_field` across records post-backfill.
- Both API representations: contract test proving old and new keys present and equal, in both directions.
- Rollback: run down migration, confirm `old_field` restored, re-run up.
- Removal criteria: traffic check gating step 3.

## Assumptions / unknowns to confirm
- I assume old clients both **read and write** the field; if they only read, the mirror write is unnecessary.
- I assume a column rename is intended (not just the API key). If only the API key changes, skip step 1's column rename and keep `old_field` purely as the migration rollback copy.
- Concrete names (`old_field`/`new_field`) are placeholders — supply the real field.

Want me to adjust for read-only-old-clients, or proceed with both read/write assumed?
