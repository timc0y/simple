Remove the eight unreachable template branches and their orphaned handlers/imports. Keep the four supported cases in `routeEvent` and retain its default rejection for unknown types. Do not add a dispatch abstraction; the existing owner is sufficient.

Proof:

- Run the four supported-handler tests.
- Run the unknown-type rejection test.
- Run Oxlint and confirm the complexity and unused-code errors are gone.
- Inspect the diff to ensure only unsupported routes and displaced cleanup were removed.
