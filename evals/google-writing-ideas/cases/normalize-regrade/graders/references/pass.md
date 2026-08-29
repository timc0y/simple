Keep `normalize-results.mjs` as the owner and keep its existing TSV reads and JSON
write. Add one value-level decision that receives the answer identity, rubric identity,
and grade history. It returns stable when matching identities have one verdict and
unstable when they have contradictory verdicts. Changed answer or rubric identities
start separate comparisons.

Store each grade in the existing normalized JSON record instead of replacing an older
grade. Exclude an unstable comparison from skill-gain totals.

Check the decision directly with matching verdicts, contradictory verdicts, changed
answer identity, and changed rubric identity. Keep one integration check that reads TSV
input and writes the expected JSON record.
