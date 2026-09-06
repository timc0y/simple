Use `fixture/vendor-reference.md` as the decision source. For invoice creation, retry a
429 only after `Retry-After` and only when the request carried a valid idempotency key.
If no key was sent, first inspect the invoice lookup endpoint because the request may
already have been accepted; do not retry on the 429 alone. The third-party blog's advice
to retry every 4xx does not establish Vendor X invoice safety. Verify the rule with the
existing client and an idempotent sandbox request, and preserve invoice uniqueness.
