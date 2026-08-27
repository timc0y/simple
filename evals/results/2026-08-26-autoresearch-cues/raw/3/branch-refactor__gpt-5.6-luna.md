Delete the eight unsupported handler branches and their orphaned code from `routeEvent`. Keep the four supported handlers and the existing unknown-type rejection. Do not add an abstraction solely to reduce the Oxlint score; removing unrequired branches directly addresses the cause while preserving the owner and contract.

Proof:

- Run the four supported handler tests.
- Run the unknown-type rejection test.
- Run Oxlint.
- Inspect the diff to confirm only unsupported routes and their cleanup were removed.
