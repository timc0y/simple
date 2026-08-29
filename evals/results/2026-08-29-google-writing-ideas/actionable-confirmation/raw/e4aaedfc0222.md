Changes required before approval:

- Keep all session reads and refreshes in `auth/session.ts`; do not add a second module or leave pages on parallel paths.
- Never log request headers or refresh tokens. Support-retained auth logs must exclude credentials.
- Preserve the failure contract: after a refresh failure, clear the cookie and redirect to `/login`. Pages must not receive an empty session or choose their own behavior.
- Remove the unrelated `ttl` rename from this change.

Retries are optional only if there is evidence of transient refresh failures and they remain inside `auth/session.ts`; a final failure must still clear the cookie and redirect.
