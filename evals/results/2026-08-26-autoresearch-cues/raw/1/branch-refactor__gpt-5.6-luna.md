Delete the eight unsupported handler branches from `routeEvent` and keep the existing dispatch for the four supported event types plus the unknown-type rejection path. Do not add a registry or split the function; that would add machinery without a current requirement.

Proof:

- Confirm no callers, configuration, generated code, reflection, persisted identifiers, or scripts reference the eight event types.
- Run the four supported-handler tests.
- Run the unknown-event rejection test.
- Run Oxlint and confirm `routeEvent` is below the complexity threshold.

This preserves all supported behavior and the unknown-input contract while removing only template code with no callers, retained data, or compatibility commitment.
