Do not split recovery and receipt handling into separate services. The gateway is the sole owner of the mutation interval, and both operations must run under its lock. Splitting them would divide ownership of the safety boundary and could allow release or mutation during durable uncertainty.

Treat the Oxlint result as a review signal. If the threshold must be met, extract small local helpers or methods for recovery and receipt validation while the gateway retains lock ownership, state, failure handling, and release policy. Do not extract pass-through services merely to lower one function’s metric.

Prove the behavior through the gateway’s public surface:

- Competing processes never mutate the same resource concurrently.
- Killing a lock holder permits safe dead-holder recovery.
- Invalid receipts prevent the mutation from completing.
- Injecting uncertainty-record failure leaves the resource blocked.
- Release occurs only after the required receipt and durable recording succeed.
- Recovery remains correct after process termination and restart.

The proof should be concurrency/integration-based, with forced termination and injected storage failure; a lower cyclomatic number alone is not evidence of correctness.
