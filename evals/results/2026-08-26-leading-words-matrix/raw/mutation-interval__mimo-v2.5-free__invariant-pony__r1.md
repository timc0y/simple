I need to understand the current implementation before proposing a solution. Let me explore the codebase.Now I understand the problem. This is a concurrency safety issue with a mutation lock. Let me load the relevant skill for this type of analysis.Now I understand the problem. Let me analyze and propose the solution.

## Analysis

**Current state (3 owners):**
```
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: release lock
composition root: record an unknown result when needed
```

**Root cause:** The lock is released BEFORE uncertainty is recorded. This creates two race windows:
1. Between lock release and uncertainty recording
2. Between dead holder detection and receipt conversion

## Proposed Solution: Smallest Ownership Change

**Move "record unknown result" into the gateway, BEFORE releasing the lock.**

**New flow (2 owners):**
```
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record unknown result if needed  ← NEW POSITION
gateway: release lock
```

**Why this works:**
- The lock is held until uncertainty is recorded
- No window exists between lock release and uncertainty recording
- The invariant spans only the gateway's critical section

**Failure path when recording uncertainty fails:**
If recording uncertainty fails:
1. The mutation has been performed remotely
2. But we couldn't record that we don't know the result
3. The lock is still held
4. **Do NOT release the lock** — return an error
5. The next process that tries will see the lock is held and can check the state
6. On restart, the dead holder's lock becomes an uncertainty receipt

**Independent test to prove the boundary:**
```test
test_mutation_safety_under_uncertainty_failure:
  1. Process A acquires lock
  2. Process A performs remote mutation (succeeds)
  3. Process A fails to record uncertainty (simulate disk full)
  4. Process A does NOT release lock (returns error)
  5. Process B tries to acquire lock — blocks
  6. Process A crashes (simulate kill -9)
  7. Process B starts, detects dead holder
  8. Process B converts dead holder to uncertainty receipt
  9. Process B checks receipt — sees uncertainty
  10. Process B does NOT start new mutation
  11. Process B records resolution when remote confirms
  12. Only then can Process C start a new mutation
```

**Verification:** The test proves that even when recording uncertainty fails, no duplicate mutation can occur.

---

**Summary:**
- **Ownership change:** Gateway now owns uncertainty recording (before lock release)
- **Safety claim:** At most one active mutation; no new mutation while any prior effect is unknown
- **Failure handling:** Keep lock held on recording failure, return error
- **Proof:** Independent test exercising competing processes and forced termination at every boundary transition
