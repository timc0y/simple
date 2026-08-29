Three changes block approval:

- Keep session refresh in `auth/session.ts`. Adding `auth/new-session.ts` would split one
  established owner across two paths and leave old and new pages with different session
  behaviour. Extend the existing owner instead.
- Do not log request headers or the refresh token. Support retains these logs, so the
  proposed diagnostic output would persist credentials. Log a non-secret failure reason
  or request identifier instead.
- Preserve the required failure contract. Returning an empty session lets each page
  invent different behaviour instead of clearing the cookie and redirecting to
  `/login`. Keep that handling in `auth/session.ts` after the bounded retry.

Optional: omit the `ttl` rename from this change unless it is needed for the session
work. It does not correct any stated problem.
