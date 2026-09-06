Use the receipt’s immutable logical ID as the API idempotency key.

For cursor position `n`:

```text
pending(n) → API effect confirmed → receipt ID durable → cursor n + 1 durable
```

1. Persist a delivery row for the receipt before contacting the API, including its immutable idempotency key and payload identity.
2. Call the API with that same key every time.
3. If the call fails ambiguously—or the worker restarts before recording its response—look up the receipt by key. If found, persist its receipt ID; otherwise retry the send with the same key.
4. In one local transaction, record the confirmed receipt ID and advance the cursor from `n` to `n + 1` (conditionally on it still being `n`).

The worker never advances the cursor merely because it made an API call. It advances only after it has recoverable evidence of that receipt’s external effect. The API’s idempotency key makes repeated calls safe; lookup resolves the “request may have succeeded but the response was lost” case.

The local receipt record and cursor transition must be durable and atomic together. If concurrent workers are possible, the conditional cursor update also acts as the required compare-and-set; otherwise execution must remain single-owner.

Proof: use a stateful API fake or API test environment that implements idempotency and lookup, not a fixed `200` mock. Inject a crash and restart after each transition:

- before the delivery row is durable;
- after it is durable but before sending;
- after API acceptance, before the response is observed;
- after response/lookup, before the receipt ID is persisted;
- after receipt ID persistence, before or during cursor advancement.

After each restart, assert:

- every cursor position up to the durable cursor has exactly one confirmed receipt record;
- every confirmed record has the API receipt ID for its idempotency key;
- no source receipt is skipped;
- repeated sends for a key produce one external receipt effect;
- rerunning to completion leaves the same cursor and receipt records.

This proves recovery at every interruption boundary, rather than only proving that one API call returns `200`.
