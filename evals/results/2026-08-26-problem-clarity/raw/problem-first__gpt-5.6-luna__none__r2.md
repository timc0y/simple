# The problem

Checkout is not failing because it needs microservices or RabbitMQ.

It is failing because one retry repeats a non-idempotent payment:

```text
Charge succeeds
  ↓
Inventory request times out
  ↓
Checkout retries everything
  ↓
Charge runs again without the same idempotency key
  ↓
Customer is charged twice
```

This affects about 0.4% of orders.

# Smallest supported correction

Use the payment provider’s existing idempotency feature.

For each checkout, create one stable idempotency key and reuse it for every attempt to charge that checkout:

```text
Start checkout
  ↓
Create or retrieve the checkout's idempotency key
  ↓
Charge with that key
  ↓
Inventory request times out
  ↓
Retry checkout
  ↓
Charge again with the same key
  ↓
Provider returns the original charge instead of charging again
```

The key must be stored with the checkout or order so it survives handler retries and process restarts. Checkout should also treat an inventory timeout as an uncertain state and reconcile the order rather than blindly issuing a new payment.

# What not to build yet

Do not split checkout into microservices or introduce RabbitMQ. There is no requirement for separate deployment, asynchronous checkout, or a queue, and one team handles only about 200 orders per day. Those changes would add operational complexity without addressing the immediate cause.

# Recommended next action

Create a small checkout change that:

1. Assigns and persists one idempotency key per checkout.
2. Sends that key on every payment attempt.
3. Retries inventory and checkout safely using the existing payment result.
4. Adds a test covering: payment succeeds, inventory times out, checkout retries, and the customer is charged only once.
5. Monitors duplicate-charge reports and payment-provider responses after release.

This directly targets the failure with the smallest change that the current system supports.
