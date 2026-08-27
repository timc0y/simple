Now I have the full picture. Here is the implementation proposal based on the Simple design method, using only the facts established in `SIMPLE.md`.

---

## Design

### Required outcome

Rename one persisted field. Preserve the old public API shape for 90 days so existing clients continue to work. Produce a verifiable migration that leaves stored data intact.

### Facts established

| Fact | Source |
|---|---|
| External API clients exist and are published | SIMPLE.md |
| Customer records must survive the rename | SIMPLE.md |
| 90-day deprecation promise applies | SIMPLE.md |
| Schema changes use the service's existing migration mechanism | SIMPLE.md |

### Design

**1. Storage layer — two columns, one migration**

Use the existing migration mechanism to add the new column alongside the old one. Backfill the new column from the old. Run as a non-blocking, idempotent migration so it is safe to retry and rollback.

- Migration A (forward): `ALTER TABLE ... ADD COLUMN new_name <type>`.
- Migration B (backfill): `UPDATE ... SET new_name = old_name WHERE new_name IS NULL`. Batch if the table is large.
- Migration C (verify): `SELECT` count where `new_name IS NULL AND old_name IS NOT NULL` — must be zero.

Do not drop the old column yet. That is a separate removal step after the deprecation window.

**2. Application write path — dual write**

While the deprecation window is open, every write sets both columns:

```
old_name = value
new_name = value
```

This costs one extra column of storage. It guarantees both representations are always consistent and makes rollback trivial: stop setting `new_name`, revert the read path, drop the column.

**3. Application read path — configurable source**

Use a single config flag or feature toggle (not a feature flag system — just a config value) to control which column the application reads from:

- `field_source: "old"` — reads `old_name` (initial state).
- `field_source: "new"` — reads `new_name` (post-migration state).

Default to `"old"` initially. After the backfill is verified, switch to `"new"`.

**4. Public API — two representations, one deprecation**

Expose both field names in the API response during the 90-day window:

```json
{
  "old_field_name": "value",
  "new_field_name": "value"
}
```

Accept both field names on write (input). If a client sends `old_field_name`, map it to `new_field_name` internally before persisting. If a client sends `new_field_name`, use it directly.

Add a `Sunset` header and a deprecation notice in API documentation:

```
Sunset: <date 90 days from rollout>
Deprecation: old_field_name
Link: <migration guide URL>
```

**5. Rollback plan**

| Phase | Action |
|---|---|
| Pre-deploy | Migration A runs. Old column untouched. |
| Deploy | Dual-write begins. Read path stays on `old_name`. |
| Verify | Confirm backfill count is zero. Confirm new writes hit both columns. |
| Switch reads | Set `field_source: "new"`. Monitor error rates. |
| 90 days pass | Remove old column from response. Stop dual-writing. Drop old column. |

If anything fails at any phase: revert the config (`field_source: "old"`), stop setting `new_name` in new writes (or keep it — it costs nothing), and the old path is unchanged.

**6. Proof criteria**

Before proceeding through each phase, verify:

- Stored data: every row has a non-null `new_name` matching `old_name`.
- Both API representations: old clients get `old_field_name`, new clients get `new_field_name`, both return the same value.
- Rollback: switching `field_source` back to `"old"` restores original behaviour with no data loss.
- Removal criteria: deprecation period expired AND old-client traffic is zero (per SIMPLE.md's reconsideration trigger).

**7. What this does not introduce**

- No new service, abstraction, or ownership boundary.
- No feature flag system.
- No dual-write coordination service.
- No shadow reads or canary traffic routing.

The dual-write is trivial column assignment. The read-path switch is a config value. The API translation is a one-way mapping in the response serializer. All of this fits inside the existing migration mechanism and write path.

---

### Removal (after 90 days)

When the deprecation window ends and old-client traffic reaches zero:

1. Remove `old_field_name` from the API response and input mapping.
2. Stop dual-writing (set only `new_name`).
3. Drop `old_name` column via the existing migration mechanism.
4. Remove the `field_source` config and its branching.
