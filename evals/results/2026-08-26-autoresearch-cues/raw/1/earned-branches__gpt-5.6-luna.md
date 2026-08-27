Do not split recovery and receipt handling into services. The mutation gateway must remain the sole owner of the mutation interval, and recovery plus receipt checks must execute under its lock. A failed uncertainty record must leave the resource blocked.

If the `<20` limit is mandatory, extract cohesive private functions within the gateway—such as `recoverDeadHolder`, `validateReceipt`, and `recordUncertainty`—while passing the lock-held context explicitly. This changes the measured complexity of the entry function without creating another owner, lock, state store, or workflow. If the lint rule measures aggregate complexity or the extraction only disguises the state machine, retain the code and document a narrowly scoped exception instead.

Proof should use competing processes and force termination at each interval boundary, then inject receipt rejection and durable-record failure. Verify that:

- only one process mutates at a time;
- a dead holder is recovered safely;
- rejected receipts prevent release;
- uncertainty-record failure keeps the resource blocked;
- successful operations release exactly once;
- crash recovery preserves these guarantees.
