## The failure

```text
Charge succeeds → inventory times out → handler retries everything → charge runs again
```

No payment idempotency key is sent, so the provider treats the retry as a new charge.

## Smallest supported correction

Do not split checkout or add RabbitMQ. At 200 orders/day, neither addresses the duplicate-charge cause.

```text
Checkout/order ID → stable payment idempotency key → payment provider
                                         ↑ reused on every retry
```

- Send one stable idempotency key for the logical checkout on every payment attempt.
- On an inventory timeout, retry or reconcile inventory separately; do not initiate another payment.
- Add one regression check: a timeout followed by retry results in exactly one provider charge.

## Next action

Create a checkout change to use the existing durable checkout/order identifier as the payment idempotency key (if it meets the provider’s format/uniqueness rules), then verify it in the provider’s test environment. Add a queue or service split only if a separate deployment or asynchronous workflow becomes an actual requirement.
