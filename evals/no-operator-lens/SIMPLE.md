# Simple

## Reality

- Stage and users: Internal application maintained by one product team.
- External consumers: None.
- Persistent production data: The helper name is not persisted.
- Compatibility commitments: None for this internal symbol.

## Preserve

- Runtime behaviour and the helper's return value.

## Current boundary

- `loadAccount` is an internal helper with three internal callers.

## Ordinary paths

- Rename the helper and its three callers directly.

## Proof

- Run the affected tests and type-check, then search for the old name.

## Reconsider when

- Another repository or published interface depends on the symbol.
