# Rename loadAccount to loadCustomer

Outcome: rename the internal helper `loadAccount` to `loadCustomer` with no change
in behaviour.

Facts: the helper has three internal callers, no external consumers, no retained
identifiers, and no compatibility promises to keep the old name.

Steps:

1. Rename the `loadAccount` definition to `loadCustomer`.
2. Update the three internal call sites to reference `loadCustomer`.
3. Search the repository for any remaining `loadAccount` references (imports,
   re-exports, mocks, comments, docs) and update them.

Proof:

- Run the tests that exercise the three call sites.
- Run the type-check.
- Search the repository for `loadAccount` and confirm no matches remain.
