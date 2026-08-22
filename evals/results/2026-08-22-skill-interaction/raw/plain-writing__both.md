# Rename `loadAccount` to `loadCustomer`

## Change

Rename the internal helper `loadAccount` to `loadCustomer` and update its three
internal call sites. No external consumers, retained identifiers, or compatibility
shims apply, so this is a straight rename with no adapter or alias.

## Steps

1. Rename the function definition.
2. Update all three call sites to the new name.
3. Update any local imports, type signatures, or comments that reference the old
   name.

## Constraint

Behaviour must not change. This is a rename only — no logic, arguments, return
values, or call order change.

## Proof

- Run the tests covering the three callers; they must pass unchanged.
- Run the type-check; it must pass with no errors.
- Search the codebase for `loadAccount`; it must return no matches.
