The smallest ownership change is: make the gateway own the entire mutation transaction, including uncertainty handling.

```text
gateway:
  acquire lock
  reconcile any dead holder into a durable uncertainty receipt
  if receipt exists: refuse/replay according to policy
  perform remote mutation
  if outcome is unknown:
      persist uncertainty receipt
      if persistence fails:
          keep the lock held and fail/retry; never release it
  release lock
```

The composition root should only call one gateway operation. It must not check receipts or record uncertainty independently.

This fixes both races:

- The lock is released only after the receipt is durable.
- A new acquisition first resolves a dead holder. If that conversion cannot be persisted, acquisition—and therefore mutation—fails.

The safety tradeoff is intentional: a recording failure may sacrifice availability, and a dead holder may conservatively become “unknown,” but neither path permits a possible duplicate mutation.

The independent boundary test should use fakes and assert ordering:

1. Remote mutation returns `unknown`.
2. Receipt persistence is paused.
3. Assert the lock is still held and a second mutation cannot start.
4. Allow receipt persistence to succeed.
5. Assert only then is the lock released.

Add the same assertion for dead-holder recovery: receipt conversion must complete before the next mutation is admitted.
