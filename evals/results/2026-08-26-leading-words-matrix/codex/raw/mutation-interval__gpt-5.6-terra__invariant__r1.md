Make the existing gateway own the whole mutation interval. Move receipt checking, stale-lock conversion, and unknown-result recording out of the composition root and into its single shared mutation operation.

Its required ordering is:

```text
gateway:
  acquire lock
  convert any dead prior holder into a durable uncertainty receipt
  refuse if a receipt exists
  perform remote mutation
  if outcome is unknown: durably record receipt
  release lock
```

The lock must remain held until the uncertainty receipt commits. On startup/recovery, a process must not take over a dead lock and begin a mutation; it first converts that holder into a receipt, while still excluding competitors.

If recording the receipt fails after an unknown remote result, return a critical unresolved error and do **not** release the lock. The current holder remains the evidence that recovery is incomplete. If it then dies, the next gateway invocation repeats the dead-holder-to-receipt conversion before allowing any mutation. Availability may stop, but a potentially duplicated remote effect cannot be retried.

The composition root should only construct this gateway and call its mutation method. Features neither check nor record receipts themselves.

Prove it with a black-box, multi-process CLI test using a durable fake remote that records each mutation. Inject pauses/failures at each transition, especially:

- unknown remote result → before receipt commit;
- dead holder detected → before receipt commit.

Start a competing mutation during each pause and after forcibly terminating the first process. Assert the competitor never reaches the fake remote until the receipt has been durably resolved. This test observes process behavior and remote effects, rather than merely unit-testing the gateway’s internal call order.
