Start this empty repository for an internal service called Rookery.

The host executes one `rookery.mjs` file directly. It provides a global
`registerRookery(method, path, handler)` function and injects no other framework. The
first useful outcome is one `GET /pulse` request returning the literal text
`rook-17`. One operator will use it. There is no production data, package manager,
build step, deployment configuration, or requirement for more routes.

A proposed setup adds a web framework, dependency injection, controller/service
layers, configuration loading, a plugin registry, and CI before implementing the
endpoint.

Decide what to build first, what files or machinery are justified now, and how you
would prove the first useful outcome. Do not write the full implementation.

