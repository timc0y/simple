# Recommendation

Do not split checkout into microservices or add RabbitMQ. The measured failure is a retry-safety bug inside the existing checkout handler.

Add a stable payment idempotency key and reuse it for every retry of the same payment operation. Keep checkout owned by the existing team and keep the current synchronous flow.

## What happens now

```text
Checkout
  ├─ Charge customer: succeeds
  ├─ Request inventory: times out
  └─ Retry the whole operation
       ├─ Charge customer again: succeeds again
       └─ Request inventory again
```

The retry has no way to tell the payment provider that the charge was already made. That produces the observed double charge.

## Smallest correction

```text
Checkout
  ├─ Create one payment key for this payment operation
  ├─ Charge with that key
  ├─ Request inventory: times out
  └─ Retry the operation with the same payment key
       ├─ Provider returns the original charge result
       └─ No second charge is created
```

The key must be stable across handler retries and process recovery. Use the order ID only if an order can have exactly one charge. Otherwise use a persisted payment-attempt ID. Do not generate a new key for each retry.

The checkout handler remains responsible for:

- creating or loading the payment key;
- sending it on every payment-provider request for that payment;
- interpreting the provider’s idempotent response;
- retrying only failures that are safe to retry.

This addresses the double-charge obstruction without adding another owner, deployment, queue, or asynchronous workflow.

## Boundaries to confirm

Before implementation, verify the payment provider’s:

- idempotency-key retention period;
- behavior when the first request succeeds but its response is lost;
- behavior for retries with the same key and different request parameters;
- error response when a key is reused incorrectly.

Also check whether inventory requests are themselves idempotent. The payment fix prevents double charging, but repeating the whole checkout may still duplicate an inventory reservation if that operation has the same weakness.

## Proof

Test the existing checkout surface with these cases:

1. Payment succeeds and inventory succeeds: one charge.
2. Payment succeeds, inventory times out, and checkout retries: one charge.
3. The payment response is lost and checkout retries: one charge.
4. The same key is reused with different payment details: the request is rejected safely.
5. A genuinely new payment attempt receives a new key.

Monitor the count of provider charges per order and the existing 0.4% failure path after release.

The next action is to confirm the provider semantics and inventory idempotency, then make this focused checkout change and verify it with failure-injection tests. Reconsider service separation or messaging only if a demonstrated requirement emerges, such as independent deployment, sustained throughput pressure, or a required asynchronous checkout workflow.
