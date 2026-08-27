The supported fix is to make the existing payment call idempotent, not to split checkout or add RabbitMQ.

Today the failure is:

```text
charge succeeds → inventory request times out → checkout retries whole operation → second charge
```

The product problem is duplicate customer charges: about 0.4% of orders are affected. The cause is known: checkout retries a completed charge without giving the payment provider a stable idempotency key.

Corrected flow:

```text
checkout creates one stable key per order/payment attempt
→ charge with that key
→ inventory request times out
→ retry charge with the same key
→ provider returns the original charge instead of creating another
```

This preserves checkout’s current synchronous flow and its retry behaviour while preventing duplicate charges. It requires no separate deployment, queue, asynchronous checkout, or new service ownership; one team already owns the relevant handler and the volume is about 200 orders per day.

Next action: have the checkout team define where the stable payment idempotency key is stored or derived, send it on every payment attempt and retry, and add an integration test that simulates a successful charge followed by an inventory timeout. The test should prove that the retry results in one provider charge for one order.

Reconsider a queue or service split only if a separate, demonstrated need emerges—for example, an explicit asynchronous-checkout requirement, independent deployment need, or a distinct ownership boundary.
