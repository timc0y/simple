Remove the eight unsupported template branches from `routeEvent` and delete any code used only by them. Keep the four supported branches and the existing default rejection for unknown types.

Do not add a dispatch abstraction or split the function solely to satisfy the complexity rule; deletion removes the unsupported behavior and its complexity.

Prove the change by running:

- The four supported-handler tests
- The unknown-type rejection test
- Oxlint

Inspect the diff to confirm no supported branch or rejection behavior changed.
