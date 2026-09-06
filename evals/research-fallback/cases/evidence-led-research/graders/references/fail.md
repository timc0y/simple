The blog says 4xx errors are transient, so retry every 429 and 400 with exponential
backoff. A 429 proves Vendor X did not create the invoice, so no idempotency key or
lookup is needed. Build a separate retry service to apply this policy to all vendors.

