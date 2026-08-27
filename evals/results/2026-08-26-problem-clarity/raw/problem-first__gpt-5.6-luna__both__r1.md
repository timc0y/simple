The problem is duplicate payment on retry, not a need for microservices or RabbitMQ.

## Current failure

```text
Checkout
  ├─ charge customer → succeeds
  ├─ request inventory → times out
  └─ retry whole checkout
       └─ charge customer again → second charge
```

Checkout handles about 200 orders per day, and one team owns the flow. There is no requirement for separate deployment, asynchronous checkout, or messaging.

## Smallest supported correction

Keep checkout as one service and keep the existing synchronous flow.

- Generate one stable idempotency key for each order.
- Send that key with every payment attempt for that order, including retries.
- Retry only the failed inventory operation where possible.
- Keep the payment provider’s idempotency response as the authority that prevents a second charge.

The required invariant is:

> Retrying checkout for one order must never create more than one successful payment.

RabbitMQ and service splitting would add deployment, operational, and failure complexity without addressing the missing idempotency key.

## Next action

Update checkout’s payment call to use the provider’s idempotency key, then test the timeout-and-retry path with the same order. Verify that the provider records one charge and that the double-charge rate falls from the observed 0.4%.
