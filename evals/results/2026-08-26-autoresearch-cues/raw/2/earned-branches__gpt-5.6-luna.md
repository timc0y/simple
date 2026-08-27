Keep the mutation gateway as the sole owner. Do not split recovery or receipt handling into services; that would divide the lock-held safety interval and weaken crash and failure guarantees.

To reduce the reported complexity, extract recovery and receipt-validation/recording branches into private functions in the same gateway. Call them while the gateway still holds the lock, and keep lock acquisition, uncertainty handling, and release under that owner. A failed uncertainty record must return without releasing the resource.

Proof:

- Run competing processes against one resource and verify mutation intervals never overlap.
- Force-terminate the holder at each recovery point and verify the next attempt recovers safely.
- Inject uncertainty-record failure and verify the resource remains blocked.
- Exercise rejected receipts and verify durable uncertainty is recorded before any release.
- Run Oxlint to confirm the gateway is below 20, then verify these behaviours through the gateway’s public API.
