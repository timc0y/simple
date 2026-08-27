## What is failing

```text
charge succeeds → inventory times out → handler retries everything → charges again
```

The duplicate charge is caused by retrying a non-idempotent payment call—not by checkout being a monolith.

## Smallest correction

```text
one checkout/order → one stable payment idempotency key → reuse it on every retry
```

Send the same provider idempotency key for the initial charge and any retry. Once payment has succeeded, retry inventory only; do not initiate another charge.

Skip microservices and RabbitMQ: there is no deployment, async, or queue requirement, and ~200 orders/day does not justify adding distributed failure modes to fix a single retry bug.

## Next action

Create a focused checkout change: define where the durable per-order payment key and successful-payment state live, then add a regression test for “payment succeeds, inventory times out, retry does not create a second charge.”
