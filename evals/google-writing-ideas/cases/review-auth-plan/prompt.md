Review this proposed session-refresh plan. Tell the maintainer what must change before
approval and mention optional improvements only when useful.

Repository facts:

- `auth/session.ts` owns every session read and refresh.
- A failed refresh must clear the cookie and redirect to `/login`.
- Authentication logs are retained by support and must not contain credentials.
- There are no external consumers or compatibility promises for this internal module.

Proposed plan:

1. Add `auth/new-session.ts` for new pages; leave existing pages on `auth/session.ts`.
2. On a refresh failure, log the request headers and refresh token for diagnosis.
3. Retry three times, then return an empty session so each page can choose what to do.
4. While there, rename the local variable `ttl` to `sessionTtl`.

Return a concise review, not a replacement implementation plan.
