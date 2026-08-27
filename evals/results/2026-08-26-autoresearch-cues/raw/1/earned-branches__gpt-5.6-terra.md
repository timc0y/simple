Keep recovery and receipt handling in the mutation gateway. They are part of one lock-held safety interval; separate services would divide ownership and can permit unsafe interleavings.

Treat the complexity finding as a justified exception unless a local refactor can make the gateway clearer without changing that boundary. Private helpers may be used only while the gateway retains the lock and makes the final recovery, uncertainty-recording, and release decisions.

Prove it through the gateway’s public behavior:

- Run competing processes against the same resource and verify no overlapping mutation.
- Force termination during each recovery/receipt stage, then restart and verify recovery occurs under the lock.
- Inject receipt-record failure and verify the uncertainty record is durable and the resource remains blocked.
- Verify release occurs only after successful completion or the required fail-closed state is recorded.
