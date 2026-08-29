Review this draft CLI documentation for correctness and usefulness. Return concise
findings for the writer.

Observed behaviour:

- `sync` makes one initial request and at most two retries.
- After the third failed request it exits with status 23.
- Retry count is not configurable.
- Exit status 23 means the remote service remained unavailable.

Draft:

> Reliable syncing is central to productive teams. Modern distributed systems
> occasionally encounter transient conditions. Our robust resilience strategy keeps
> retrying until the service recovers, so users do not need to intervene. Run `sync`
> again if it stops.

Review the draft; do not rewrite the whole document.
