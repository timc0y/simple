Do not split recovery or receipt handling into services. They belong to the mutation gateway’s single lock-held safety interval.

If the lint limit must be met, refactor only within the gateway: extract gateway-private helpers for recovery and receipt validation, invoked while the gateway holds the same lock and with no independent state, lock, or release path. Keep uncertainty recording fail-closed: if recording fails or confirms uncertainty, the resource remains blocked.

Prove the behavior through the gateway’s public interface:

- Run competing processes against one resource; only one may enter the mutation interval.
- Terminate the holder during recovery and verify the next process recovers safely under the gateway lock.
- Inject receipt rejection and receipt-record failure; verify no mutation is accepted without a valid receipt and failed uncertainty recording leaves the resource blocked.
- Verify release occurs only after the terminal success or fail-closed state is durable.
- Run Oxlint to confirm the gateway function is below 20, but treat that as a refactoring constraint rather than proof of safety.
