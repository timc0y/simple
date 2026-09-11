All three done. Tests pass.

- The intelligence run endpoint now refuses more than thirty requests per fifteen
  minutes per caller.
- A deploy now fails before it touches anything if either API secret is missing from
  production. Check they are set before the next release.
- Expired session-registry rows are purged in the hourly maintenance step, but only
  once they are a full session lifetime past expiry, because a revoked-session row
  also stops a logged-out session coming back. One test covers the margin.

Nothing is committed.
