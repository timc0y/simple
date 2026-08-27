# The actual problem

Checkout retries the entire operation after the inventory request times out:

`Charge succeeds → inventory times out → checkout retries → charge runs again → customer is charged twice`

The payment provider already supports idempotency, but checkout does not use it.

# Smallest supported correction

Send one stable idempotency key with each order’s payment request. Reusing that key on retries makes the provider return the original charge instead of creating another one.

Keep checkout as one service and do not add RabbitMQ. There is no requirement for asynchronous processing, and 200 orders per day does not justify the operational cost of microservices.

# Next action

Change the checkout retry flow to reuse an order-level payment idempotency key, then test the timeout-and-retry case with the payment provider’s sandbox. Track duplicate charges afterward to confirm the fix.
