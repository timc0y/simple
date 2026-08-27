Use Simple to respond to this product owner before implementation:

> Checkout is a mess. Split it into microservices and add RabbitMQ so orders stop
> double-charging customers.

Known facts:

- About 0.4% of orders are charged twice.
- The first charge succeeds, then the inventory request times out.
- The checkout handler retries the whole operation, including the charge.
- The payment provider accepts an idempotency key, but checkout does not send one.
- One team owns checkout, which handles about 200 orders each day.
- There is no requirement for separate deployment, asynchronous checkout, or a queue.

Help the product owner nail the problem and turn the proposed implementation into the
smallest supported solution. Recommend the next action, but do not write code. Use
plain Markdown that makes the current failure and proposed correction easy to picture.
