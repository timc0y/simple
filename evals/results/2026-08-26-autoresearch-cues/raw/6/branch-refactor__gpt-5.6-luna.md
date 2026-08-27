Delete the eight unused template branches and any imports or helpers they orphan. Keep `routeEvent`’s existing dispatch path for the four supported event types and its unknown-type rejection. Do not add a registry or abstraction; it would add complexity without a current requirement.

Proof:

- Run the four supported-handler tests.
- Run the unknown-event test.
- Run Oxlint and confirm the complexity warning is gone.
