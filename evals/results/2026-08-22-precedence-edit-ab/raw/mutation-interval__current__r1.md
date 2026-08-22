I'll give the answer directly in chat instead.

## Ownership change

The invariant ("at most one active mutation" and "no new mutation while any prior effect is unknown") spans four steps currently split across two owners: the composition root checks and records the receipt; the gateway owns the lock. That split is the defect, not the lock or the receipt themselves.

Give the gateway — the existing lock owner — ownership of the entire sequence, instead of leaving receipt check/record with the composition root:

1. check outstanding receipt
2. reconcile a dead lock holder into a receipt, as a **precondition of acquiring the lock** (not a separate startup step)
3. acquire lock
4. perform remote mutation
5. record the outcome (clear on success, unknown on failure/timeout/ambiguity)
6. release lock — only **after** step 5 has completed

The composition root calls one operation on this boundary and never touches the lock or receipt store directly. This is the "one shared mutation boundary" SIMPLE.md already names — it consolidates existing ownership rather than adding a coordinator, and it doesn't require every feature to repeat the checks, since every mutating command goes through the same owner.

This closes both races:

- **Race 1** (process starts after lock release, before the unknown result is recorded): eliminated because release is now ordered strictly after record, inside one owner, instead of two calls made by two owners with a window between them.
- **Race 2** (new mutation starts before a dead holder is converted to a receipt): eliminated because that conversion is a precondition of lock acquisition itself, performed by the same owner that grants the lock — a new mutation cannot acquire the lock until reconciliation has happened.

## Failure path: recording uncertainty fails

If the remote outcome is unknown and writing the receipt fails, the gateway must **not** release the lock — the lock is the only thing currently preventing a second mutation. On a record failure it keeps the lock held and fails loudly (propagate the error, non-zero exit) instead of releasing.

That leaves a dead lock holder behind, which is exactly what startup reconciliation exists to resolve. On the next start, lock acquisition first tries to convert that dead holder into a receipt. If that conversion also fails, acquisition must fail closed: the lock stays unacquirable and no mutation proceeds, rather than silently discarding the stale lock. Uncertainty that can't be durably recorded must block progress, never be assumed away.

## Independent test

Black-box, no knowledge of internals: run the real CLI as a subprocess against a real (or faithfully faked) remote endpoint and lock/receipt store.

1. Start a mutating command and SIGKILL it at each transition point in turn: after lock acquired/before remote call; after remote call/before record; after record/before release; mid-record.
2. Immediately after each kill, start a second mutating command.
3. Assert that for every kill point, the second command blocks or refuses (lock held, or receipt outstanding) — it must never reach a second remote mutation while the first's effect is unresolved.
4. Assert the remote endpoint received the mutation at most once per run.
5. Separately, inject a receipt-store write failure at the moment of recording an unknown outcome, and assert the process holds the lock and exits non-zero rather than releasing it.

This proves the boundary from outside the process — competing processes and forced termination at every transition — rather than asserting on internal call order.

---

Note: `answer.md` in the run directory is still empty — I attempted to write the answer there but wasn't granted file-write permission. Let me know if you'd like me to try again.
