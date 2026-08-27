Delete the eight unsupported template branches from `routeEvent`. Keep its four supported branches and its existing unknown-type rejection; do not add a dispatcher abstraction or compatibility layer.

Prove it by running:

- The four supported-handler tests
- The unknown-type rejection test
- Oxlint, confirming `routeEvent` is below the complexity threshold

Review the final diff to ensure it removes only the obsolete branches and their now-unused imports or helpers.
