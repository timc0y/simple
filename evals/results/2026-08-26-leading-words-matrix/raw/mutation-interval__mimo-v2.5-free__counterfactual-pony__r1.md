Let me first understand the codebase to see what's currently implemented.The working directory contains only the prompt and context files — no application code. This is a design problem, not a code review. Let me reason through it.

## The Problem

The two races exist because the **lock owner** (gateway) and the **receipt owner** (composition root) are different components. There's a window between "lock released" and "receipt recorded" where both doors are open.

**Race 1:** Process B starts in that window — sees no lock, no receipt, proceeds.

**Race 2:** Process A dies holding the lock. On next startup, the dead-holder→receipt conversion is not yet complete when Process B begins.

## The Smallest Ownership Change

Move **receipt checking and recording into the gateway**, so the gateway owns the entire mutation interval:

```text
gateway: check outstanding receipt          (was: composition root)
gateway: acquire lock
gateway: perform remote mutation
gateway: release lock AND record receipt    (was: composition root, separately)
```

Now a single component owns all four steps. There is no window between lock release and receipt recording — they happen in one operation.

**Startup dead-holder conversion** stays as a gateway-side responsibility. When a process starts and finds a stale lock, the gateway itself converts it to an uncertainty receipt before attempting any new mutation. No separate coordinator is needed.

## Failure Path: Recording Uncertainty Fails

If recording the receipt fails after a successful mutation:

1. The lock is released.
2. The receipt is **not** written.
3. On next startup (or next mutation attempt), the gateway sees: "lock is free, but the last mutation's result is unknown." This is the same dead-holder state — the gateway converts it to a receipt and retries or asks the operator.

The safety invariant holds because **an unknown result is never silently discarded** — it's always converted into a receipt before the next mutation proceeds.

## Independent Test That Proves the Boundary

Kill the process **between lock release and receipt write** (force the gateway to crash after `unlock` but before `recordReceipt`). On restart, verify:

1. The stale lock is detected and converted to an uncertainty receipt.
2. No second mutation proceeds until that receipt is resolved.
3. The mutation is applied at most once.

This test exercises the exact window where both races live. If it passes, the ownership boundary is correct.

---

**In short:** The gateway already owns the lock. Give it ownership of the receipt too. One component, one interval, no gap.
