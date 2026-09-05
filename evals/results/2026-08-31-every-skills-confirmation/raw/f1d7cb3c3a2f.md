Keep the existing order: confirm the external effect, durably record its receipt ID, then advance the cursor. Do not advance immediately after the API call.

For each source receipt, use a stable idempotency key derived from its immutable identity. If no such identity exists, durably create and store the key before the first send.

```text
next uncompleted receipt
  → send with its stable idempotency key
  → if response is lost/crash occurs, look up by that key
  → durably record the returned receipt ID against that receipt
  → atomically advance the cursor past receipts whose IDs are recorded
```

On restart, a receipt without a recorded ID is not assumed unsent: look it up by its key first, then send or retry with that same key only if no effect exists. A receipt with an ID is never sent again; the worker only advances the cursor if needed. If multiple workers can run, serialize cursor advancement with the existing transaction/lease or compare-and-set mechanism.

The required invariant is:

> A cursor position is passed only when every preceding receipt has a durable receipt ID; every external send for a receipt uses one stable idempotency key.

This prevents both reported failures:

| Crash point | Recovery |
|---|---|
| Before API accepts | Retry with the same key |
| After API accepts, before local record | Lookup returns the already-created receipt; record its ID |
| After recording ID, before cursor advance | Advance without sending |
| After cursor advance | Receipt ID proves the cursor did not skip it |

Prove it with restart tests against a stateful API fake that implements idempotency and key lookup—not a static `200` mock. Inject termination after each transition, restart from the persisted worker state, and assert for every receipt that:

- the API has at most one effect for its key;
- the stored receipt ID equals the API’s receipt ID;
- the final cursor passes only contiguous receipts with stored IDs.

Also test lost responses, transient API failures, duplicate retries, and the crash between recording the ID and advancing the cursor.
