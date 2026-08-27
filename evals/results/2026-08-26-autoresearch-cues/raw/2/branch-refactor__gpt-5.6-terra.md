Delete the eight unsupported template branches from `routeEvent`; do not add helper abstractions or retain compatibility paths.

Preserve handling for the four supported event types and rejection of unknown types. Confirm no dynamic/configured entry point names the removed types, then inspect the diff to ensure it only removes obsolete branches.

Proof:

- Run the four supported-handler tests.
- Run the unknown-type rejection test.
- Run Oxlint and confirm `routeEvent` is below the complexity limit.
