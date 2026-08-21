## 1. Code comment

```js
// Retry network failures only; validation failures are permanent.
```

## 2. Decision note

# Retry policy

Only network failures are retried. Network failures are transient, so a retry can
succeed. Validation failures are permanent, so retrying them cannot change the
outcome.

Reconsider this if another failure class gains different retry behaviour.

## 3. Development update

Retries are now limited to network failures. Validation failures fail immediately,
since they are permanent and a retry cannot change the outcome. The reason is
recorded in a comment beside the retry code and in a short decision note.
