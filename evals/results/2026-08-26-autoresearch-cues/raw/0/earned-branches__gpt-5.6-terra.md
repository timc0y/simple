Do not split recovery or receipt handling into services. They are part of the mutation gateway’s single safety interval and must run while it holds the lock.

If the complexity limit must be met, extract only private, synchronous gateway helpers and pass the held-lock context explicitly. Keep lock acquisition/release, recovery, receipt validation, and fail-closed uncertainty recording under the gateway’s control; a failed uncertainty record must leave the resource blocked.

Prove it with competing processes:

- Force-terminate the lock holder during mutation, then verify recovery happens before another mutation proceeds.
- Inject receipt-record failure and verify the resource remains blocked.
- Race two processes for the same resource and verify no mutation or recovery step escapes the gateway’s lock.
