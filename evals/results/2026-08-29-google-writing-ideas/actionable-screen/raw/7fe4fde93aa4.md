Approval is blocked by items 1–3:

- Keep `auth/session.ts` as the sole owner. There are no external consumers or compatibility promises, so `auth/new-session.ts` would create an unnecessary split path.
- Do not log request headers or refresh tokens. They may contain credentials. Log only redacted, non-sensitive diagnostic context.
- Preserve the required failure contract: clear the cookie and redirect to `/login`. Returning an empty session shifts security behavior to every page. Retry only if there is evidence of transient refresh failures, with a bounded policy that still ends in that contract.

Renaming `ttl` to `sessionTtl` is a useful optional clarity improvement, but it should not be part of approval criteria unless the current name is genuinely ambiguous. Add tests that independently verify the failure redirect, cookie clearing, and credential-free logs.
