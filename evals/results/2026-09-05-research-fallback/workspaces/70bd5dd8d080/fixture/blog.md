# Blog post: Make HTTP retries easy

The author recommends retrying every 4xx response with exponential backoff. The post
does not discuss Vendor X invoices, idempotency keys, or whether a request was accepted
before a response was returned.
