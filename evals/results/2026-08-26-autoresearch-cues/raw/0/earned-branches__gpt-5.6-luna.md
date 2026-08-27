Keep the mutation gateway as the sole owner. Do not split recovery or receipt handling into services; that would divide the lock-held safety interval and weaken fail-closed recovery.

Reduce the reported complexity locally by extracting cohesive, synchronous helpers for dead-holder recovery and receipt validation. Pass the already-held lock context explicitly, keep durable uncertainty recording in the gateway’s path, and release only after successful receipt handling or durable uncertainty recording. If uncertainty recording fails, leave the resource blocked.

Prove the behavior with black-box process tests:

- Competing processes never mutate concurrently.
- Force-terminate a holder at each recovery/receipt phase, then verify crash recovery.
- Reject receipts and verify the mutation is not released.
- Inject uncertainty-record failure and verify the resource remains blocked.
- Run Oxlint to confirm the gateway is below 20.

This lowers the function’s measured complexity without adding an owner, service boundary, or second workflow.
