Remove the eight unused template branches from `routeEvent`. Keep its existing ownership, the four supported handlers, and the unknown-type rejection path. Do not add a dispatch abstraction or compatibility layer; no callers, retained data, or compatibility commitments require those branches.

Proof:

```sh
# Run the four supported-handler tests and the unknown-type test
# Then run:
oxlint
```

The tests must confirm unchanged behavior for all four supported event types and rejection of unknown types. Oxlint should confirm that the measured complexity is resolved.
