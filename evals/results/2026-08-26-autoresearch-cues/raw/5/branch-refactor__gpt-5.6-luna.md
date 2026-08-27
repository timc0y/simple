Delete the eight unused event branches from `routeEvent`, keeping its existing routing behavior for the four supported types and its unknown-type rejection.

This is the smallest safe change because `routeEvent` remains the sole owner, while the removed branches have no callers, retained data, or compatibility commitment. Avoid introducing a dispatch abstraction or changing the public interface.

Proof:

- Run the four supported-handler tests.
- Run the unknown-event rejection test.
- Run Oxlint and confirm the complexity violation is resolved.
- Inspect the diff to verify only the eight unreachable branches and their orphaned code were removed.
