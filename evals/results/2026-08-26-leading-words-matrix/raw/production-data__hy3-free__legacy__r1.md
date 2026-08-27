I'll start by reading the SIMPLE.md file and then load the Simple skill.Let me read the compatibility reference and explore the repository structure.Let me read the case files: prompt.md and run.json.I have what I need. This is a self-contained case: no application code exists, only the `SIMPLE.md` framing a production service with published API clients, retained customer records, and a 90-day deprecation promise. The task is a **design** decision, so I'll apply Simple's method and the compatibility reference.

## Design: rename a persisted field and its public API representation

### Obligations established (from `SIMPLE.md`)
- Production service; external/ published API clients depend on the current field name.
- Retained customer records must survive — no data loss.
- A 90-day deprecation promise is in force; old and new clients must both work during it.
- Ordinary path for storage change: the service's existing migration mechanism.
- Proof must cover stored data, both API representations, rollback, and removal criteria.
- Reconsider/remove compatibility only when the 90-day window ends **and** old-client traffic is zero.

### What must be preserved vs. replaced
- Preserve: customer data; the published API contract for the old name through the deprecation window.
- Replace: the internal storage field name and the public API field name, after the window.

### Smallest honest design (two layers, one deprecation window)

**1. Persisted (storage) field — internal, no external contract**
- Use the existing migration mechanism (the ordinary path). Apply expand/contract:
  - Add the new column/field; backfill from the old field; verify row counts and spot-check values (no loss).
  - Have the application read/write only the new field.
  - Keep the old field populated as a mirror until the API removal criteria are met, then drop it in a **separate, later** migration. This keeps deploy rollback safe and bounds the dual state to the deprecation window.
  - Ship an up **and** down migration so storage is reversible.

**2. Public API representation — external, under the 90-day promise**
- Add **one bounded adapter at the serialization boundary** that maps the value between the old API name and the new API name. During the window the endpoint accepts and emits *both* names for the same value; new clients adopt the new name, old clients keep the old. No API versioning, no feature flags, no shadow system.
- Publish the deprecation with the explicit 90-day end date.
- Remove the adapter only when both hold: (a) 90 days elapsed, (b) old-name traffic is zero.

This matches the compatibility reference's "real old and new callers → one bounded adapter with an exit condition," and avoids permanent abstraction.

### Proof (per `SIMPLE.md` Proof section)
- **Stored data:** backfill verification (count + spot checks) and a passing down-migration.
- **Both API representations:** a contract test asserting `old_name` and `new_name` are both present and equal; an old-style request (sends `old_name`) and a new-style request (sends `new_name`) both succeed and return the field under both names.
- **Rollback:** migration down script; adapter removable independently of storage.
- **Removal criteria:** a guardrail check (old-name request rate == 0) gated on the 90-day clock, recorded as the trigger for the later drop-old-field migration and adapter deletion.

### Establish before implementing (facts not present in `SIMPLE.md`)
These are genuine unknowns; the plan should not invent them:
- The actual old and new field names, and whether the field is **writable** via the API (determines whether the adapter must map writes, not just reads).
- The API surface affected (single resource, list/pagination, webhooks, generated SDKs) — defines where the adapter lives.
- Whether the 90-day clock has already started (i.e., has the deprecation been publicly announced). Until it has, the old name is still the live contract and the window hasn't opened.

### Not doing
- No whole-API versioning, no permanent dual-write beyond the deprecation window, no feature flag, no second migration path. Each compatibility piece has a named consumer (old clients) and a single exit condition.

Want me to confirm the field names, read/write direction, and whether the deprecation clock has started before this moves to implementation?
