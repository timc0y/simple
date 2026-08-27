I'll explore the codebase to understand the current concurrency control mechanism and identify the smallest ownership change to fix the races.Now I have the full picture. Let me formulate the plan based on first principles.

## Analysis

The problem is that **ownership is split across two boundaries**. The gateway owns the lock but the composition root owns receipt checking/recording. This creates a gap between lock release and uncertainty recording.

**Current (broken) sequence:**
```
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform mutation
gateway: release lock          ← gap opens here
composition root: record unknown result  ← too late
```

**Race 1:** Process B starts after lock release but before receipt recording. It sees no lock AND no outstanding receipt. Both processes mutate.

**Race 2:** Process A dies holding lock. Process B starts. Process B doesn't convert dead holder to receipt before its own mutation.

## The Smallest Ownership Change

**Move uncertainty recording inside the lock boundary.** The gateway already owns the lock; it should own the entire safety interval:

```
gateway: check outstanding receipt
gateway: acquire lock
gateway: perform mutation
gateway: record unknown result when needed
gateway: release lock
```

This eliminates the gap. The lock protects both the mutation and the recording of uncertainty. No new coordinator, no repeated feature checks.

## Failure Path When Recording Uncertainty Fails

If recording fails after a successful mutation:

1. The mutation is committed remotely but the receipt is not written
2. The lock must NOT be released normally — it must force recovery
3. On next startup, the dead lock holder is detected and converted to an uncertainty receipt before any new mutation proceeds

The receipt write must be durable (fsync). If the receipt disk is full or corrupt, the lock remains held and the CLI exits with an error requiring manual recovery.

## Independent Test

A test that proves the boundary by **forcing termination at every transition point**:

1. Start mutation, kill process after lock acquire but before mutation → verify no receipt recorded, next process recovers
2. Start mutation, kill process after mutation but before receipt recording → verify next process detects dead holder, converts to receipt, blocks new mutation until receipt resolved
3. Start mutation, kill process after receipt recording but before lock release → verify next process detects dead holder, sees receipt, blocks new mutation
4. Run two competing CLI processes, verify at most one mutation succeeds

The test must be process-level (fork/exec), not in-process mocking, because it proves the actual ownership boundary survives across process boundaries.

---

**The change:** One owner (gateway) owns the full interval: check → lock → mutate → record → unlock. The composition root becomes a passthrough. The lock and receipt share the same transactional substrate.
