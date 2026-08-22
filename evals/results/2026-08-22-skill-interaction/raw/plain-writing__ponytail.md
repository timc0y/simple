# Rename `loadAccount` to `loadCustomer`

## Steps
1. Rename the function definition from `loadAccount` to `loadCustomer`.
2. Update all three internal call sites to use the new name.
3. Search the codebase for any remaining references to `loadAccount` and update them.

## Notes
- This is a rename only. No behaviour changes.
- No external callers or compatibility shims are needed.

## Proof
- Run the affected tests.
- Run the type-check.
- Search the codebase for `loadAccount` to confirm no references remain.
