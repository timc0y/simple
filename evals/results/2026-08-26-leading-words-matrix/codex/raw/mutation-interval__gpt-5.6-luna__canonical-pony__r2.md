The smallest safe change is to make the existing mutation boundary own the entire interval—not add a coordinator.

The gateway (or shared mutation-boundary API) should:

1. Acquire the durable lock first.
2. Recover any dead holder while the lock remains blocking. Persist its uncertainty receipt before treating the lock as available.
3. Check for an existing receipt while holding the lock.
4. Perform the remote mutation.
5. If the result is uncertain, persist the receipt while still holding the lock.
6. Release the lock only after the receipt is durable.

So the composition root no longer checks or records mutation safety state, and features do not repeat those checks.

If receipt recording fails, fail closed: keep the durable lock in a blocked/recovery state and reject the new mutation. A later startup retries receipt persistence. An expired lease must mean “recover this holder,” not “grant the lock to someone else.” The lock record therefore needs enough information to create the receipt.

The proof should be a black-box integration test through the public CLI/mutation boundary:

- pause or kill a process after the remote effect but before uncertainty recording;
- start a competing process;
- assert that the second process neither performs the mutation nor proceeds until the receipt exists;
- force receipt persistence to fail and assert the lock remains blocking;
- retry recovery and assert exactly one remote mutation and one durable receipt.

This preserves one owner and closes both doors: lock release cannot precede receipt recording, and stale-lock recovery cannot precede receipt conversion.
