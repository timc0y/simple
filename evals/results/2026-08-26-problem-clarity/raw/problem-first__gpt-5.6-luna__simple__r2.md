# The problem is duplicate charging during retry

At present, checkout does this:

```text
1. Charge the customer — succeeds
2. Request inventory — times out
3. Retry the whole checkout
4. Charge the customer again
```

The retry represents one order, but the payment provider receives two unidentifiable charge requests. That is why about 0.4% of orders are charged twice.

Microservices and RabbitMQ do not address this cause. There is no requirement for separate deployment, asynchronous checkout, or a queue, and checkout handles only about 200 orders per day. Adding them would increase operational complexity without satisfying a known need.

## Smallest supported correction

Keep checkout as the owner and make its existing retry safe:

```text
1. Derive one stable idempotency key for the order's payment
2. Send that key with the first charge request
3. Reuse the same key whenever checkout retries that charge
4. Retry inventory independently
```

The key must identify the logical payment, not an individual HTTP attempt. A retry for the same order must therefore use the same key; a different order must use a different key.

The required invariant is:

> One logical order payment produces at most one provider charge, regardless of checkout retries.

This preserves the current checkout flow and uses the payment provider’s existing capability. No new service, queue, deployment boundary, or asynchronous workflow is required.

## Next action

Inspect the checkout handler and confirm that it has a stable order identifier available before charging. Then verify the provider’s idempotency-key behaviour, including how long keys remain effective and what response a repeated key returns.

Implement the smallest change that:

- creates or retrieves one payment key per order;
- sends it on every charge attempt;
- does not generate a new key during retries;
- lets the inventory retry continue without issuing a new payment.

Prove the correction with an integration test that forces the inventory request to time out after the first successful charge, retries checkout, and verifies that the provider records one charge and checkout reaches the correct final state. Reconsider a queue or service split only if a separate deployment, asynchronous processing, throughput, or ownership requirement appears.
