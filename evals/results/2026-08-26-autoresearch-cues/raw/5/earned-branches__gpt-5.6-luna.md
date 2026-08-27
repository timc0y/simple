Keep the mutation gateway as the sole owner. Splitting recovery and receipt handling into services would divide the lock interval and weaken the required guarantees.

If the threshold must be met, extract cohesive private functions within the gateway:

- dead-holder recovery;
- receipt validation;
- durable uncertainty recording.

The gateway must still hold the same lock through recovery, validation, recording, and release. A failed uncertainty write must prevent release, preserving the fail-closed state. This reduces local control-flow complexity without introducing owners, services, protocols, or new failure paths.

Prove it through the gateway’s public behavior:

- Competing processes show that only one mutation proceeds.
- Force-terminate the holder and verify the next process recovers safely.
- Reject receipts and verify the mutation remains protected.
- Inject uncertainty-record failure and verify the resource stays blocked.
- Verify release occurs only after successful receipt handling and durable recording.
- Run Oxlint afterward, while checking total behavior rather than treating the complexity score as the design objective.
