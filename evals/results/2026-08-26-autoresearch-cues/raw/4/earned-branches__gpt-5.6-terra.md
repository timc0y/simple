Keep recovery and receipt handling in the mutation gateway. Do not create separate services merely to lower a complexity metric: they would split the lock-held safety interval across owners.

If the threshold is mandatory, extract only local/private helpers and call them while the gateway still holds the lock. The gateway must retain acquisition, recovery, receipt validation, durable uncertainty recording, and release orchestration. A failed uncertainty-record write must leave the resource blocked.

Prove this through the public mutation path:

- Run competing processes against the same resource; only one may enter the mutation interval.
- Force termination during mutation, then verify recovery occurs under the next holder’s lock.
- Inject receipt-record failure and verify the durable uncertainty record is retained and subsequent mutations remain blocked.
- Confirm release occurs only after the required recovery and receipt outcomes.
