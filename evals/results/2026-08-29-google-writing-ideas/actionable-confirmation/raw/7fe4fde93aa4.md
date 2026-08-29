Request changes before approval:

- Keep `auth/session.ts` as the sole owner. Adding `auth/new-session.ts` creates a parallel path without a demonstrated need. Extend the existing module for new pages.
- Remove refresh tokens and credentials from logs. If diagnosis is needed, log only safe metadata such as a request ID and failure category; redact sensitive headers.
- Preserve the failure contract: after any bounded retry policy is exhausted, clear the cookie and redirect to `/login`. Returning an empty session shifts required policy to every page and violates the stated behavior.
- Treat the `ttl` → `sessionTtl` rename as optional cleanup. It is safe but unrelated, so it should not block the refresh change.

Retries are useful only if there is evidence of transient refresh failures; they must remain bounded and must not change the final failure behavior.
