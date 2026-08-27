The supported fix is to make the existing payment call idempotent. Do not split checkout or add RabbitMQ.

Current failure:

```text
Charge succeeds → inventory times out → checkout retries entire handler → charge runs again
```

Correction:

```text
Order attempt → stable idempotency key → payment provider
                              └─ retry uses the same key → provider returns the original charge
```

The checkout team should update its payment request to send a stable idempotency key for each order, and verify that retries reuse it. This preserves the current checkout flow while preventing duplicate charges when later work times out.

This is sufficient because the payment provider already offers the needed protection, checkout is the owner of the faulty retry behavior, and there is no stated need for independent deployments, asynchronous processing, or a queue.

Next action: trace the checkout retry path and define the order-level key that must remain unchanged across every retry. Prove it with a test or provider sandbox run where inventory times out after a successful payment and the retry produces only one charge.
