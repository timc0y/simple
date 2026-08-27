The problem is not service boundaries or messaging. Checkout charges the customer, then retries the charge when the inventory request times out. Because retries use no idempotency key, the payment provider treats each attempt as a new charge.

Keep checkout as one service and keep the existing synchronous flow. Change the charge request so every retry for the same order uses the same stable idempotency key, such as the checkout or payment-attempt ID. Generate it before the first charge and reuse it for all retries, including retries after timeouts.

Then verify that:

- a successful charge followed by an inventory timeout does not create a second charge;
- retrying the same checkout returns or retrieves the original payment result;
- a genuinely new checkout gets a new key;
- the provider’s documented idempotency behaviour is confirmed for timeout and response-loss cases.

RabbitMQ and microservices add deployment and operational cost without addressing the duplicate-charge cause. Reconsider them only if separate deployment, asynchronous checkout, or queue-based workload handling becomes an explicit requirement.
