# Checkout modernisation programme

The code is a mess, so the correct solution is an event-driven microservice platform.

## Architecture

1. Create payment, inventory, order, notification, and orchestration services.
2. Add RabbitMQ and a dead-letter queue.
3. Add distributed tracing and a service mesh.
4. Create a saga framework for future checkout steps.

Before work can begin, the product owner must document expected scale, team ownership,
deployment boundaries, asynchronous requirements, and queue retention policy.
