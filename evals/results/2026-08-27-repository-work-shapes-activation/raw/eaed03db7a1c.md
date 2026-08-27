Build one thing first: `rookery.mjs`.

It should directly register exactly one route:

- method: `GET`
- path: `/pulse`
- handler result/body: literal text `rook-17`

The file should use the injected global directly. No imports, framework, dependency injection, controller/service split, configuration, plugin registry, package metadata, build step, deployment files, or CI are justified by the stated requirements. They add ownership and failure modes without solving an existing problem.

A minimal repository shape is therefore:

```text
rookery.mjs
```

For proof, run the real host and issue:

```text
GET /pulse
```

Verify that the response is exactly `rook-17`, including no JSON wrapping or extra route behavior. If the host is not available locally, use a temporary Node smoke harness with `node:assert` that defines `registerRookery`, loads `rookery.mjs`, checks the registered method and path, invokes the handler, and checks the returned text. That proves the file’s contract without introducing a runtime dependency.

Add further machinery only when a concrete requirement appears—for example, another route, persistent data, configuration variation, multiple operators, or a repeatable deployment obligation.
