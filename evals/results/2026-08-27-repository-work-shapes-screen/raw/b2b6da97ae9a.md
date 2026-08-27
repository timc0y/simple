Build one file: `rookery.mjs`.

It should register `GET /pulse` through the supplied `registerRookery` function. Its handler returns the literal text `rook-17`.

Nothing else is justified yet: no framework, packages, configuration, layers, plugin registry, CI, or additional route structure. There is one host-provided integration point, one operator, and one required response; direct registration is the ordinary path.

Prove the outcome through the host’s public surface:

1. Run the host with `rookery.mjs`.
2. Send `GET /pulse`.
3. Verify the response body is exactly `rook-17`.

Reconsider the shape only when a concrete new requirement appears, such as shared route behaviour, configuration from an external source, or additional routes with genuinely shared policy.
