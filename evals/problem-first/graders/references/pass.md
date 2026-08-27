The problem is not that checkout lacks microservices or a queue. Customers can be
charged twice when an inventory timeout causes the whole checkout operation to run
again.

Current failure:

`charge succeeds -> inventory times out -> whole checkout retries -> charge runs again`

Keep the existing checkout service. Give each checkout attempt a stable payment
idempotency key, and retry the inventory request without repeating the completed
payment step.

This directly removes the second charge while preserving the current owner and
synchronous checkout. Separate services and RabbitMQ do not address another stated
requirement, so they are unnecessary here.

Next, add a test that reproduces a successful charge followed by an inventory timeout.
The test should prove that the retry makes only one effective charge and can still
complete the order.
