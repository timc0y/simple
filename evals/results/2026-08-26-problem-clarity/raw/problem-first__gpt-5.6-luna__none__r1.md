# The problem

Checkout retries the entire workflow when inventory times out:

```text
1. Charge customer       → succeeds
2. Request inventory     → times out
3. Retry entire checkout
4. Charge customer again → succeeds again
```

About 0.4% of orders—roughly 1 in 250—are double-charged because the payment retry looks like a new payment.

The issue is not that checkout needs microservices or RabbitMQ. The issue is that retries are not safe.

# Smallest supported correction

Use the payment provider’s idempotency feature:

```text
One checkout/payment attempt
        │
        └── stable idempotency key
                │
        retry ──┘
```

For a retry of the same payment, checkout must send the same idempotency key. The provider will then return the original charge result instead of charging the customer again.

Also change the retry boundary:

- Retry the inventory request independently when appropriate.
- Do not automatically repeat the payment as a new operation.
- Treat a timed-out inventory request as an uncertain checkout state that needs clear recovery or reconciliation.

# Out of scope for now

There is no evidence that the team needs:

- Separate microservice deployments
- Asynchronous checkout
- RabbitMQ
- A larger ownership or architecture change

Those would add operational complexity without addressing the demonstrated cause.

# Recommended next action

Create a small checkout reliability change containing:

1. A stable payment idempotency key reused across retries.
2. Retry handling that does not restart the payment blindly.
3. Tests covering “charge succeeds, inventory times out, checkout retries.”
4. Monitoring for duplicate-charge attempts and unresolved checkout states.

Validate this in staging, then release it behind a controlled rollout.
