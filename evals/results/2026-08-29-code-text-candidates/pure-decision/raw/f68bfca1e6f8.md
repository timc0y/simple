## Plan

1. In `normalize-results.mjs`, isolate grade comparison into a small pure function used by `buildRecords`. It accepts the prior grade and candidate grade and returns the retained grade state; it performs no reads or writes.

2. Compare grades only when both the answer identity and rubric identity match. For that same comparison:
   - retain the first grade rather than replacing it;
   - if verdicts agree, retain the existing grade;
   - if verdicts differ, mark that grade `unstable`.
   A grade marked `unstable` must contribute no skill gain.

3. When either answer or rubric differs, treat the candidate as a new comparison under the existing record/result structure. Do not compare verdicts across those identities or mark either result unstable.

4. Keep TSV reads and `results.json` writing in `normalizeResults`; do not change the output format or introduce another owner. Remove any overwrite branch displaced by the comparison policy.

## Proof

Test the pure comparison function directly, with in-memory inputs:

- first grade is retained when a second matching grade arrives;
- matching answer and rubric with the same verdict remains stable;
- matching answer and rubric with different verdicts becomes `unstable`;
- an unstable result produces no skill gain;
- changing the answer produces a separate comparison without instability;
- changing the rubric produces a separate comparison without instability.

Add one `buildRecords` test showing that the policy is applied during normalization, while no test needs files or `normalizeResults` filesystem setup.
