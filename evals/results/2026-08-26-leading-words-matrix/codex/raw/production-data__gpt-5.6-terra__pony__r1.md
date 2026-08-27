Use an expand–migrate–contract rollout; do not perform an in-place database rename.

1. Add `new_field` through the existing migration mechanism, retaining `old_field`. Backfill `new_field` from `old_field`, with an idempotent/resumable job for retained records.

2. Make `new_field` canonical in the service. During 90 days:
   - New API representation reads/writes `new_field`.
   - Deprecated API representation maps `old_field` to/from the canonical value.
   - Continue dual-writing storage so an application rollback remains safe.
   - If one request can send both names, reject conflicting values.

3. Verify:
   - Existing records retain their values after backfill.
   - Old and new API clients each receive and can update their expected field name.
   - Rolling back the application still reads correct data.
   - Track old-representation traffic.

4. After 90 days *and* old-client traffic is zero, remove the deprecated API field, stop dual writes, then run a later migration to drop `old_field`.

This preserves customer records and the published contract while keeping rollback possible. The minimal approach adds one temporary compatibility path—no separate compatibility service or custom migration framework.
