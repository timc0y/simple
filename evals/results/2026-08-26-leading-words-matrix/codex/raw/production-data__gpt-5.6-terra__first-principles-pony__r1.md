Use one canonical renamed persisted field and a temporary API-boundary alias.

1. Use the service’s existing migration mechanism to rename `old_name` to `new_name`. Prefer a native column/field rename so the stored value is preserved; do not create copied columns or a second data source.

2. Change repository/domain code to use `new_name` only.

3. At the public API boundary for the 90-day promise:
   - Accept both `oldName` and `newName` on input, mapping either to `new_name`.
   - Reject requests that provide conflicting values for both names.
   - Return both `oldName` and `newName`, with the same canonical value, so published old clients and new clients both work.
   - Mark `oldName` deprecated in the API schema/docs and record use through existing API telemetry.

4. Keep the migration reversible: its rollback renames `new_name` back to `old_name`. Exercise this in the normal migration rollback environment.

Proof:
- A retained record survives the migration with its value intact.
- Old-only, new-only, and matching-both API requests succeed; conflicting-both input fails validation.
- Responses contain both representations with identical values.
- Migration rollback restores the prior schema and data access.
- After 90 days, remove the alias and old response field only when telemetry shows old-name traffic is zero.

This adds one bounded compatibility adapter at the API boundary; the database and internal code have exactly one field name and one source of truth.
