This is a pure design problem—no codebase to explore. Let me load the skill that's designed for this kind of reasoning, then work through it.Here's the analysis and design, following Simple's design order.

---

## Actual users and consequences

- One installation, multiple sequential or competing CLI processes.
- Remote mutations and local uncertainty receipts outlive a command.
- A gap in the safety interval duplicates a remote mutation.

## Required invariant

No new mutation while any prior effect is unknown. At most one active mutation.

## Existing owner and ordinary path

The composition root checks receipts and records uncertainty. The gateway acquires the lock, performs the mutation, and releases the lock. These are two different owners. The invariant spans four operations across two owners.

## Exact missing capability

The uncertainty receipt is recorded **after** the lock is released. This creates a window where a new process starts, sees no lock and no receipt, and begins a new mutation while the prior effect is still unknown.

## Smallest ownership change

**Move "record uncertainty receipt" into the gateway, while the lock is still held.**

| Current owner | Proposed owner | Operation |
|---|---|---|
| Composition root | Gateway (lock owner) | Record uncertainty receipt |

New sequence:

```
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt   ← moved here, while lock held
gateway: release lock
```

Composition root still checks receipts. It no longer records them. The gateway owns the entire interval from lock acquisition through uncertainty recording. The lock release happens last, after the receipt is durable.

**Dead lock holder on startup:** The gateway's lock-acquisition path checks for a dead holder. If found, it converts the dead holder to an uncertainty receipt before proceeding. This is the same owner (gateway) performing the same operation (record uncertainty), just earlier in the flow.

## Failure path when recording uncertainty fails

If the gateway cannot write the uncertainty receipt (disk full, permission error):

1. The mutation was already performed remotely.
2. The receipt was not written.
3. The lock is released.
4. The mutation is considered **failed**—the caller receives an error stating the outcome is unknown.
5. The caller must verify the actual state before retrying.

This avoids deadlock (the lock is released) and avoids silent duplication (the caller is told the outcome is uncertain and must check). It is consistent with the existing uncertainty receipt mechanism: the caller already knows how to handle unknown results.

## Independent test

The test proves the invariant boundary, not the implementation:

1. **Start a mutation.** Record an uncertainty receipt. Attempt to start a second mutation.
2. **Verify the second mutation blocks or fails** until the uncertainty is resolved (receipt cleared or mutation confirmed).
3. **Force the uncertainty recording to fail.** Verify the mutation is rejected and the caller receives an error indicating unknown outcome.
4. **Run competing processes at every boundary transition:** lock acquisition, mutation execution, uncertainty recording, lock release. Force termination (kill -9) at each point. Verify no duplicate mutation is applied.

The test surface is: "Can two mutations ever overlap while both effects are unknown?" If the test cannot trigger this state, the boundary holds.
