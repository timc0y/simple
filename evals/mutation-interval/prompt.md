## The lock with two open doors

A CLI already has both a mutation lock and a durable uncertainty receipt. Yet a
mutation can still be applied twice.

The current sequence crosses three owners:

```text
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: release lock
composition root: record an unknown result when needed
```

On startup, a dead lock holder may also need to become an uncertainty receipt.

Two races have been observed:

1. A process starts after the lock is released but before an unknown result is recorded.
2. A new mutation starts before a dead holder has been converted into a receipt.

Adding another coordinator and making every feature repeat the checks have both been
proposed. Find the smallest ownership change that makes the safety claim true. Include
the failure path when recording uncertainty itself fails and the independent test
that would prove the boundary.
