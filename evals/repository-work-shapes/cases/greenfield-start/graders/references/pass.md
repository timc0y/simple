Build one file: `rookery.mjs`. Register `GET /pulse` directly with
`registerRookery` and have the handler return the literal text `rook-17`.

The first slice is complete when the host executes that file and a request to
`GET /pulse` receives status 200 with the exact body `rook-17`. Exercise that request
through the host's real local runner, or its smallest faithful request harness if the
host has no local command.

Nothing else is justified yet. The host already supplies routing and execution, and
the repository has no dependencies, build, configuration, additional routes, or
production data. Add supporting machinery only when a real second requirement cannot
be expressed through this direct path.

