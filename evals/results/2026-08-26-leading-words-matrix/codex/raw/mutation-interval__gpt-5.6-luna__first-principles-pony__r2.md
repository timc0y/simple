The smallest fix is to make the existing mutation gateway own the entire safety interval.

Its public operation should be the only mutating boundary:

```text
gateway:
  acquire mutation lock
  while holding it:
    resolve any abandoned holder into a durable uncertainty receipt
    reject if any receipt exists
    perform remote mutation
    if result is unknown:
      durably record receipt
      do not continue until recording succeeds
  release lock
```

The composition root must stop checking or recording receipts. Features must call this gateway only.

The critical rule is:

> Never release the mutation lock after an unknown remote outcome until the uncertainty receipt is durable.

If receipt recording fails, fail closed: retain the lock or leave an equivalent durable “recovery required” lock state, report the failure, and prevent all new mutations. Retrying recovery must be possible. Releasing the lock on that path recreates the race.

Abandoned-lock recovery belongs to the same lock owner. Acquisition must atomically—or under the lock store’s exclusive recovery operation—convert a dead holder into a receipt before making the lock available. If the lock primitive releases on process death and provides no durable owner/recovery state, the safety claim cannot be made true by rearranging callers; the lock and receipt need one transactional substrate or a durable lease record.

The independent proof is a black-box competing-process test:

1. Start a mutation process and force termination after the remote effect but before uncertainty recording.
2. Start a second process immediately.
3. Assert it cannot perform the mutation: it must observe the durable receipt or a recovery-required lock.
4. Force uncertainty recording to fail and assert the lock remains blocking.
5. Repeat with normal completion and verify the lock is released only after the receipt/result transition.

That test must use separate processes and the real lock, receipt store, and gateway surface—not mocks of the internal checks.
