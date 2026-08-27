# The actual problem

The flow currently does this:

```text
Charge customer ✅
Inventory request times out ❌
Retry entire checkout
Charge customer again ❌ → duplicate charge
```

This is a retry/idempotency bug, not a microservices or messaging problem.

# Smallest supported correction

Send a stable payment idempotency key for each order/payment attempt.

```text
Checkout retry
  └─ same order/payment key
       └─ payment provider returns the original charge
```

Keep the existing checkout service and synchronous flow. Do not add microservices or RabbitMQ; there is no requirement or scale justification for them.

# Recommended next action

Create a small fix ticket to:

1. Generate and persist one idempotency key per payment.
2. Reuse it whenever checkout retries that payment.
3. Add one test covering a successful charge followed by an inventory timeout and retry.

This directly addresses the known failure with the least change.
