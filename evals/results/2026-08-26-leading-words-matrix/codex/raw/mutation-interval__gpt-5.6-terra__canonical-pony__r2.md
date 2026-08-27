Move the receipt lifecycle into the existing shared mutation gateway. It must own one safety interval:

```text
acquire or recover lock
→ check durable receipt
→ perform mutation
→ if result is unknown, durably record receipt
→ release lock
```

The composition root should only invoke `gateway.mutate(...)`; it must not check or create receipts.

Recovery belongs to lock acquisition too. Before a contender can replace a dead holder, the gateway must first durably create that holder’s uncertainty receipt. If that write fails, it must not grant the lock or run a mutation. Conservatively creating a receipt for an abandoned holder is safe; it may block work, but cannot duplicate it.

Likewise, after an unknown remote result, failure to record the receipt means **do not release the lock**. If the process later dies, recovery repeats the same conversion-before-handoff rule. This trades availability for the required safety claim.

The independent proof is a process-level crash test against the public CLI/gateway boundary with a counted fake remote service:

- Kill process A after its remote request may have taken effect, at every transition through receipt persistence and lock release.
- Start process B and attempt the same mutation.
- Assert B never invokes the remote service: it either finds the receipt or is refused because receipt recovery/persistence failed.
- Include a forced receipt-store write failure, then kill A; B must still not mutate.

That test proves the boundary, rather than merely asserting that individual receipt or lock methods were called.
