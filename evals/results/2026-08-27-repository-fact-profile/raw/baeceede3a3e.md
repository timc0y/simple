Implement the rename as one bounded compatibility change:

1. Add a reversible schema migration that renames the persisted field in place, preserving all customer data. Do not create a second column or dual-write path.

2. Make the new field name canonical in the model and internal code.

3. Extend the existing `CustomerSerializer` deprecation alias to:
   - accept the old and new API names;
   - reject requests containing conflicting values;
   - serialize the canonical value under both names;
   - mark the old name deprecated with the existing 90-day deadline.

4. Verify:

   - existing records retain the same values;
   - old-only, new-only, and mixed requests behave correctly;
   - conflicting values are rejected;
   - responses contain both representations;
   - migration rollback restores the previous field name and data;
   - old-client traffic reaches zero before removing the alias and old response name.

If deployments can run old and new application versions simultaneously, confirm the migration mechanism supports that rollout order; otherwise the old binary may still reference the renamed database field.
