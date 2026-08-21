1. Code comment

// Retry only on network failure. Validation failures are permanent: the
// input won't become valid on a second attempt, so retrying wastes a call
// and delays the real error.

2. Decision note (retry-policy.md)

# Retry policy

Only network failures are retried. Network failures are transient and may
succeed on a later attempt. Validation failures are permanent, so they are
not retried.

Reconsider if another failure class needs different retry behaviour.

3. Development update

Retry logic now only retries network failures. Validation failures are
permanent, so retrying them couldn't change the outcome — they fail fast
instead. Documented in retry-policy.md next to the retry code.
