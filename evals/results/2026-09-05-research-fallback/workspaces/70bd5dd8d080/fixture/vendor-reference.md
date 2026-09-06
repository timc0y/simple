# Vendor X API reference (current)

For `POST /invoices`, a 429 response may be retried after the supplied `Retry-After`
interval only when the request includes a valid `Idempotency-Key`. Without that key,
the server may have accepted the invoice before returning 429; clients must inspect
the invoice lookup endpoint before attempting anything again. A 400 response is not
retryable.
