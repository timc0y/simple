Checkout double-charges because its retry repeats a successful payment after inventory times out.

```text
Current failure
charge succeeds → inventory times out → retry whole checkout → charge runs again
```

At ~200 orders/day, 0.4% means roughly 0.8 duplicate charges per day.

The supported correction is not microservices or RabbitMQ. Those add deployment and operational complexity without addressing the direct cause.

```text
Corrected flow
create one payment idempotency key per checkout → reuse it on every retry
charge succeeds → inventory times out → retry → provider returns original charge, not a new one
```

Smallest solution:

- Generate and persist a stable payment idempotency key for each checkout/order attempt before calling the payment provider.
- Send that same key on the initial payment request and every retry.
- Keep the existing synchronous checkout and current team ownership.
- Verify the provider’s idempotency retention period covers the checkout retry window.

Next action: have the checkout team write a short retry/idempotency design and test plan, including a forced inventory-timeout test that confirms multiple retries create exactly one provider charge.
