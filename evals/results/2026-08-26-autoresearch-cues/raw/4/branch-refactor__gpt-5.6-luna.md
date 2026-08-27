Delete the eight unsupported template branches from `routeEvent` and keep its existing selection logic for the four supported event types. Preserve explicit rejection of unknown types.

Do not add a dispatch abstraction or compatibility layer: `routeEvent` remains the owner, and the removed branches have no callers, retained data, or compatibility obligations.

Proof:

- Run the four supported-handler tests.
- Run the unknown-event rejection test.
- Run Oxlint and confirm the complexity warning is resolved.
