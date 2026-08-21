# Rename loadAccount to loadCustomer

Rename the internal helper `loadAccount` to `loadCustomer`. No external consumers, retained identifiers, or compatibility promises exist, so this is a plain rename with no shim.

## Steps

1. Rename the function definition from `loadAccount` to `loadCustomer`.
2. Update its three internal callers to use the new name.
3. Search the codebase for any remaining references to `loadAccount` (comments, imports, tests, docs) and update them.

## Proof

- Run the affected tests.
- Run type-check.
- Search the codebase for `loadAccount` and confirm no matches remain.
