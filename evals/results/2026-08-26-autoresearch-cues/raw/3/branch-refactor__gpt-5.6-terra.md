Delete the eight unsupported template branches from `routeEvent`, leaving the existing four supported branches and the default rejection for unknown event types. Remove any imports or helper code made orphaned by those branches; do not add a new dispatch abstraction.

This preserves the supported contract while removing the source of the reported complexity.

Proof:

- Run the four supported-handler tests.
- Run the unknown-type rejection test.
- Run Oxlint and confirm `routeEvent` no longer exceeds the complexity threshold.
- Inspect the diff for orphaned code or an alternate routing path.
