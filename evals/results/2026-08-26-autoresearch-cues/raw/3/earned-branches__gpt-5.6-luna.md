Keep the mutation gateway as the sole owner. Do not split recovery or receipt handling into services: that would divide the lock interval and violate the required safety invariant.

If the `<20` threshold is mandatory, extract cohesive private functions—such as dead-holder recovery and receipt validation—called only while the gateway holds the lock. This reduces the gateway’s reported complexity without moving ownership, state, or failure handling. Preserve fail-closed uncertainty recording and release ordering.

Prove the result through competing processes and the gateway’s public surface:

- concurrent mutations remain serialized;
- a dead holder is recovered safely;
- rejected receipts do not release the resource;
- failed uncertainty recording leaves it blocked;
- forced termination permits correct recovery;
- successful durable recording is the only path to release.

The metric may improve, but the proof must show that the mutation interval and crash-safety guarantees did not change.
