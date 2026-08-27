Do not split recovery or receipt handling into services. They are part of the mutation gateway’s single safety interval: acquire lock, recover, reject or record receipt, durably record uncertainty on failure, then release.

If the complexity limit must be met, extract private gateway helpers and pass the held-lock context to them. Keep lock ownership, sequencing, and fail-closed uncertainty recording in the gateway; do not add another owner or execution path merely to reduce a lint number.

Prove it through the gateway’s public mutation path:

- Run competing processes against one resource; only one mutation may proceed.
- Force termination at each interval boundary; restart recovery must preserve correctness.
- Inject receipt-record failure; the uncertainty record must be durable and the resource must remain blocked.
- Confirm release occurs only after successful completion or the required durable failure state.

This preserves the existing safety contract while reducing per-function cyclomatic complexity without dividing ownership.
