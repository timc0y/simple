Remove the eight unsupported template branches from `routeEvent` (and their now-unreachable handlers). Keep the existing four supported branches and the current unknown-type rejection.

Do not replace the switch with a registry or new abstraction: no present requirement needs one.

Proof:

- Run the four supported-handler tests.
- Run the unknown-type rejection test.
- Run Oxlint and confirm `routeEvent` is within the complexity limit.
- Inspect the diff to ensure only obsolete branches and their orphaned code were removed.
