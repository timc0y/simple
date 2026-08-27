The problem is ownership split: composition root owns receipt check/record, gateway owns lock. This creates a gap between lock release and uncertainty record.

## Smallest ownership change

**Move both receipt check and uncertainty recording into the gateway**, under the same lock acquisition. The gateway becomes the single owner of the entire mutation interval:

```
gateway: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record unknown result (before or during lock release)
gateway: release lock
```

This eliminates both races:
1. No gap between lock release and uncertainty record — lock is held until record completes
2. Dead holder conversion happens under the same lock before any new mutation starts

## Failure path when recording uncertainty fails

If recording fails, the lock remains held. On next startup, the dead holder (this process) is converted into an uncertainty receipt. The safety invariant holds: no duplicate because the lock prevents entry, and the receipt prevents the next process from re-executing.

## Independent test

Force-kill process A after mutation succeeds but before uncertainty is recorded. Start process B. Process B must see the uncertainty receipt (from A's dead holder conversion) and refuse to re-execute the mutation. This proves the boundary holds.

---

Want me to write this up as a formal plan or update the SIMPLE.md with the new ownership model?
