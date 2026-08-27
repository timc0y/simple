# Simple

## Reality

- `routeEvent` owns event selection.
- Four event types are supported and covered by tests.
- Eight copied template branches have no callers, retained data, or compatibility
  commitment.

## Preserve

- Behaviour for the four supported event types and rejection of unknown types.

## Proof

- Run the four handler tests, the unknown-type test, and Oxlint.
