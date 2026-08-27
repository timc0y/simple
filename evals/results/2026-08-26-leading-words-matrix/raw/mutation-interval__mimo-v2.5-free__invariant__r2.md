Let me explore the codebase to understand the current implementation before planning.Now I have a clear picture. Here is the plan:

---

## The Problem

The mutation interval spans three owners:

```
composition root: check outstanding receipt
gateway: acquire lock → perform mutation → release lock
composition root: record uncertainty receipt
```

This creates two races:

1. **Receipt gap:** Process B starts after gateway releases lock but before composition root records the receipt. B sees no receipt, acquires the lock, and mutates again — the same mutation applied twice.
2. **Dead holder gap:** Process B starts before the dead holder's state is converted to a receipt. B sees no receipt, acquires the lock, and mutates — also a duplicate.

## The Fix

**Give the gateway sole ownership of the entire mutation interval.** The gateway checks the receipt, acquires the lock, mutates, records the receipt when needed, and only releases the lock after the receipt is written.

```
gateway: check outstanding receipt
gateway: acquire lock
gateway: perform mutation
gateway: record receipt if outcome unknown
gateway: release lock
```

The composition root becomes a thin caller that delegates to the gateway. No new coordinator, no repeated checks in every feature.

## Failure Path

If recording the receipt itself fails after a successful mutation:

1. The mutation already happened on the remote.
2. The lock is still held.
3. The gateway retries the receipt write (idempotent — same mutation ID, same "unknown" state).
4. If the retry fails persistently, the gateway releases the lock **without clearing the receipt**. The receipt stays as the conservative outcome: the next process start will find it and resolve the uncertainty before mutating again.

The safety claim holds because the receipt is written before the lock is released. If the receipt write fails, the lock is not released until the retry succeeds — or the receipt remains, blocking the next mutation until the uncertainty is resolved.

## Independent Proof

A test that exercises the boundary directly:

```
1. Start process A, trigger a mutation, kill it between remote success and receipt write.
2. Start process B immediately.
3. Assert B finds the outstanding receipt and does NOT mutate again.
4. Assert B resolves the receipt (confirms or clears it).
5. Assert only one remote mutation occurred.
```

This test proves the invariant: no new mutation while any prior effect is unknown, regardless of process lifetime.
