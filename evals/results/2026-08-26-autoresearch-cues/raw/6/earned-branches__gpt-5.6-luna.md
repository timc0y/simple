Keep the mutation gateway as the sole owner. Do not split recovery or receipt handling into services: both must run under the same lock, and a failed uncertainty record must keep the resource blocked.

To reduce the reported complexity, extract recovery and receipt handling into private functions or local modules with narrow interfaces. The gateway should still acquire the lock, invoke them synchronously, record durable uncertainty, and release the lock. Preserve fail-closed behavior and crash recovery. This lowers the gateway’s measured complexity without dividing the safety interval or creating new service ownership.

Proof should exercise the public mutation path with:

- Competing processes, verifying that only one mutates at a time.
- Forced holder termination, verifying dead-holder recovery.
- Invalid receipts, verifying rejection while the lock remains correctly managed.
- Injected uncertainty-record failure, verifying the resource remains blocked.
- Successful completion, verifying release occurs exactly once.

The change is sufficient if the gateway falls below 20 and these invariants still hold. Reconsider the boundary only if recovery or receipt handling develops an independent owner, lifecycle, or externally consumed contract.
