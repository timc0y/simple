## 1. Code comment

```js
// Retry network failures only; they are transient. Validation failures are
// permanent and retrying them cannot change the outcome.
```

## 2. Decision note

Retries apply to network failures only. Network failures are transient and may
succeed on a later attempt. Validation failures are permanent: the same input
will fail the same way every time, so retrying wastes an attempt and delays the
real error reaching the caller.

## 3. Development update

Retry logic now distinguishes failure types: network failures are retried,
validation failures are not. Validation failures are permanent, so retrying
them can't change the outcome — they now surface immediately instead of
burning retry attempts. No other retry behaviour changed.
