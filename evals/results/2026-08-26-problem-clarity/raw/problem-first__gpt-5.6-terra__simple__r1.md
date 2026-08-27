Do not split checkout or add RabbitMQ. The supported fix is to make each logical order charge idempotent in the existing checkout handler.

Current failure:

```text
charge succeeds → inventory times out → checkout retries → charge runs again
```

The payment provider already offers the missing safeguard. Checkout should send an idempotency key for the charge and reuse that exact key whenever it retries the same order. The provider can then return the original charge result instead of creating a second charge.

This preserves checkout as the single owner and directly addresses the observed 0.4% duplicate-charge rate. Microservices and a queue add deployment and recovery complexity, but there is no requirement they satisfy here—and neither inherently prevents a repeated payment request.

Next action: confirm checkout has a stable order or payment-attempt identity that survives its retry. Use that identity for the provider’s idempotency key, then test the exact failure path: successful first charge, inventory timeout, whole-operation retry, and one resulting provider charge.
