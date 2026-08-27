Implement as a staged expand/contract migration:

1. Add the new persisted field; keep the old field.
2. Backfill the new field from existing records.
3. Read the new field, falling back to the old field.
4. On writes, populate both fields.
5. Public API accepts and returns both representations during the 90-day deprecation window; mark the old name deprecated.
6. Monitor old-client traffic and verify both stored fields and API forms.
7. After 90 days, when old traffic reaches zero, remove the old API field and delete the old persisted field via the normal migration mechanism.

Rollback is straightforward before removal: switch reads back to the old field and stop requiring the new representation. Do not physically rename or drop the old field during the compatibility period.
