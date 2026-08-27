Remove the eight unsupported template branches from `routeEvent`; keep event selection in `routeEvent` for the four supported types and retain its unknown-type rejection.

Do not add a dispatcher, registry, compatibility shim, or new dependency—the only missing requirement is removal of unused branches that inflate complexity.

Proof:

1. Run the four supported-handler tests.
2. Run the unknown-type rejection test.
3. Run Oxlint and confirm `routeEvent` no longer reports the complexity violation.
4. Inspect the diff to ensure it removes only the eight unsupported paths and their orphaned code.
