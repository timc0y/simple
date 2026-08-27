Build only `rookery.mjs` first:

```js
registerRookery("GET", "/pulse", () => "rook-17");
```

Justified now:

- One file, one route, no dependencies or framework.
- No configuration, layers, plugin system, CI, build step, or deployment files.

Prove it with the host’s smallest smoke test: load `rookery.mjs`, invoke the registered `GET /pulse` handler, and assert the response is exactly `rook-17`.
