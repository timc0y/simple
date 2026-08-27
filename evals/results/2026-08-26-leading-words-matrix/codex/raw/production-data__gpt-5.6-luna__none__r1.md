## Proposal

Use an expand–migrate–contract rollout, preserving both names for the 90-day deprecation period.

Assume:

- Persisted field: `old_field` → `new_field`
- Public API property: `oldName` → `newName`

### 1. Expand the schema

Add `new_field` using the existing migration mechanism. Keep `old_field` intact.

Update the model/service layer to:

- Read `new_field` first, falling back to `old_field`.
- Write both fields with the same value.
- Treat conflicts as an observable error, with `new_field` authoritative.

```text
read:
  value = new_field ?? old_field

write:
  new_field = value
  old_field = value   # retained during deprecation
```

### 2. Support both API representations

For the 90-day transition:

- Accept both `oldName` and `newName` on input.
- Reject requests that provide conflicting values.
- Prefer `newName` when both are supplied.
- Emit `newName` as the canonical response property.
- Optionally emit `oldName` as a deprecated alias if existing clients require it.
- Mark `oldName` as deprecated in the published schema and documentation.

A response compatibility policy should be chosen explicitly:

```json
{
  "newName": "value",
  "oldName": "value"
}
```

If old clients can tolerate the response change, return only `newName` and preserve backward compatibility solely on input. Otherwise, return both during the transition.

### 3. Backfill existing records

Run an idempotent background migration:

```text
for each record:
  if new_field is null and old_field is not null:
    new_field = old_field
```

Track:

- Records processed and failed
- Records still missing `new_field`
- Conflicting values between the two fields
- Retry progress

Do not delete or overwrite `old_field` during backfill.

### 4. Verify before contraction

Verify:

- Existing records retain their values.
- New and old API clients can read and write successfully.
- `old_field` and `new_field` remain consistent.
- Rollback restores the previous application version without data loss.
- No unresolved backfill failures or field conflicts remain.

Add request metrics split by API property so old-client usage is measurable.

### 5. Remove the old representation

After at least 90 days, once old-client traffic reaches zero:

1. Stop accepting `oldName`.
2. Stop emitting `oldName`.
3. Remove old-field dual writes.
4. Take a final backup/verification snapshot.
5. Remove `old_field` in a separate migration.
6. Remove compatibility code and deprecation metrics.

If old-client traffic remains, extend the deprecation period rather than removing the field.

This preserves retained customer data, supports both client generations throughout the transition, and leaves a rollback path until the old representation is no longer needed.
