Do not split checkout or add RabbitMQ. The double charge has a direct, local cause: checkout retries a successful payment after inventory times out.

Current failure:

```text
charge succeeds → inventory times out → retry whole checkout → charge again
```

Corrected flow:

```text
use one stable payment idempotency key → charge succeeds → inventory times out
→ retry with the same key → provider returns the original charge, not a new one
```

Checkout remains the owner. The missing precondition is a payment idempotency key that stays the same for every retry of the same order/payment attempt. RabbitMQ and microservices do not address that missing key, and there is no stated need for separate deployment or asynchronous checkout.

Next action: have the checkout team trace the retry boundary and choose an existing stable order or payment-attempt identifier for the provider key. Then prove the change by forcing an inventory timeout after a successful charge and confirming that retries produce exactly one provider charge.

Reconsider broader architecture only if a separate, evidenced requirement emerges—for example, independently deployed checkout components or durable asynchronous processing.
