# Implementation Plan: Rename `loadAccount` to `loadCustomer`

Rename the internal helper and its three call sites. No behavior change, no external consumers or compatibility concerns, so this is a pure rename.

## Steps

1. Rename the function definition from `loadAccount` to `loadCustomer`.
2. Update all three internal call sites to use the new name.
3. Search the codebase for any remaining references to `loadAccount` (comments, tests, imports) and update them.

## Proof

- Run the affected tests and confirm they pass unchanged.
- Run the type-checker and confirm no errors.
- Search the repository for `loadAccount` and confirm zero matches remain.
