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

The retry decision is to retry only network failures, since they are transient.
Validation failures are permanent, so retrying them cannot change the outcome. The
comment and note above preserve that boundary and its reason.
