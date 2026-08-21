# Rename loadAccount to loadCustomer

Rename the internal helper `loadAccount` to `loadCustomer` and update its three
callers. No external consumers, retained identifiers, or compatibility promises
exist, so no alias or deprecation step is needed.

Steps:

1. Rename the function definition from `loadAccount` to `loadCustomer`.
2. Update each of the three call sites to the new name.
3. Search the codebase for any remaining reference to `loadAccount` (imports,
   tests, comments, docs) and update it.

Behaviour must not change; this is a name-only edit.

Proof:

- Run the tests covering the three callers.
- Run the type-check.
- Search the codebase for `loadAccount` and confirm no matches remain.
