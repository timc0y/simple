## Problem

Checkout retries the entire operation after an inventory timeout. That retry sends a new payment charge, so customers can be charged twice.

```text
Charge succeeds → Inventory request times out → Checkout retries everything
      ↑                                              ↓
      └────────────── second charge created ────────┘
```

At ~200 orders/day, 0.4% means roughly 0.8 double-charges per day.

## Smallest supported correction

Send the payment provider a stable idempotency key for each order’s charge, and reuse that same key on every retry.

```text
Retry #1: charge(order-123, idempotency key: order-123)
Retry #2: charge(order-123, idempotency key: order-123)
                         ↓
              provider returns the original charge,
              rather than creating another one
```

This directly addresses the known failure without adding microservices, RabbitMQ, asynchronous checkout, or separate deployment.

## Next action

Create a checkout change to generate and persist one payment idempotency key per order/payment attempt, reuse it across retries, and add a test covering: “payment succeeds, inventory times out, checkout retries, customer is charged once.”
