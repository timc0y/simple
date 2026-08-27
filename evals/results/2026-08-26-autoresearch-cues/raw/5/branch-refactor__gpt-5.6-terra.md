Delete the eight unsupported template branches from `routeEvent`; keep only the four supported handlers and the existing unknown-type rejection. Do not introduce a dispatch abstraction—the missing requirement is removal, not a new routing mechanism.

Prove it by running the four supported-handler tests, the unknown-type test, and Oxlint. Inspect the final diff to confirm the deleted branches have no remaining imports, configuration, or generated/dynamic entry points.
