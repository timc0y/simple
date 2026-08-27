## Renaming a persisted field and its public API representation

**Facts (from SIMPLE.md):** production service, external consumers on published API clients, customer records that must be retained, and a 90-day deprecation commitment. The old and new representations must both work for the length of that window. Schema changes go through the service's existing migration tool — that's the ordinary path, not a new one to invent.

The case doesn't name the actual field, table, or endpoint, so the plan below is generic; substitute the real names when you apply it.

### Obligation check (compatibility.md)

- External consumers: yes — published API clients read/write the current field name.
- Published contract: yes — the field name is part of the response/request shape.
- Retained data: yes — customer records must survive the rename.
- Deprecation period: yes, 90 days, explicit.

Real old and new callers exist → the smallest honest path is **one bounded adapter with an exit condition**, not a permanent dual-write system or a new versioning scheme.

### Proposal

**1. Storage — expand/contract via the existing migration mechanism**
- Migration adds the new column, backfills it from the old column in place (no new table, no shadow store), and the ordinary schema-migration tool handles it — same as any other rename this service already does.
- Do not drop or rename the old column yet; that happens in the contract step, after day 90.
- Application code reads/writes the new column as the single source of truth immediately after backfill; the old column becomes a synced artifact only if something outside this service still reads it directly (unlikely for persisted state — confirm before adding sync logic).

**2. Public API — one bounded adapter, not a version bump**
- Serialization/deserialization layer accepts both the old and new field name on input, and emits both on output, for the 90-day window.
- The new name is the primary, documented name going forward. The old name is marked deprecated in the API docs/changelog now, with the removal date stated.
- This lives at the existing serialization boundary (wherever request/response shape is currently built) — no new endpoint, no new API version, no feature flag. It's a rename with a grace period, not a redesign.

**3. Exit condition**
- At day 90 (2026-11-24, if the clock starts today) or when telemetry shows old-field-name traffic at zero, whichever the team's monitoring can actually observe: remove the adapter's old-name handling and drop the old column via a follow-up migration.
- Record this date/trigger wherever the team already tracks deprecations, so removal isn't forgotten.

### What NOT to build
- No API version bump — the shape is compatible, only a field name changed.
- No dual-write to two live columns — backfill once, then single source of truth.
- No feature flag — the adapter's exit condition is the deprecation date/traffic threshold, not a toggle.

### Proof (per SIMPLE.md's Proof line)
- **Stored data:** row counts and spot-checked values match pre- and post-migration; new column populated for 100% of existing records.
- **Both API representations:** integration test hits the API using the old field name and the new field name, on both read and write, confirming identical behavior.
- **Rollback:** migration is reversible (old column untouched until contract step) — verify the service can roll back to pre-migration code without data loss while the old column still exists.
- **Removal criteria:** confirm the monitoring/log signal that will trigger dropping the adapter and old column (traffic-based or date-based) is actually wired up before shipping the rename — otherwise the adapter becomes permanent by default.
