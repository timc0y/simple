Read this case's `SIMPLE.md`. Answer whether the request requires a new API alias. Use
the ordinary terminology and state the smallest action that resolves the user's need.

A teammate writes: “Can we make the `refresh` endpoint idempotent? We keep calling it
safe-to-repeat in chat.” There is no request to rename, expose, or deprecate an
endpoint, and the existing endpoint already has idempotency-key handling.
