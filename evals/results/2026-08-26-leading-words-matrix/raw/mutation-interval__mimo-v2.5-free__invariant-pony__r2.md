This is a distributed coordination problem. Let me analyze the races and propose the smallest ownership change.

## Analysis of the Two Races

**Race 1**: Lock released → unknown result recorded (gap)
- Process B starts in this window, acquires lock, applies mutation
- Process A then records "unknown result" → double application

**Race 2**: Dead holder → receipt conversion (gap)  
- Holder dies, lock is released (or TTL expires)
- New mutation starts before dead holder is converted to receipt
- New mutation sees no outstanding receipt → applies again

## Proposed Ownership Change

**Consolidate lock + receipt to a single owner**: Move both the lock acquisition and uncertainty receipt recording into the gateway. The gateway becomes the sole coordinator.

```
gateway: acquire lock (or fail)
gateway: perform remote mutation
gateway: record uncertainty receipt BEFORE releasing lock
gateway: release lock
gateway: clear receipt on confirmed success
```

This eliminates the cross-owner gaps entirely.

## Failure Path When Recording Uncertainty Fails

If `record_receipt()` fails after mutation succeeds:
1. Keep the lock held
2. Retry `record_receipt()` with exponential backoff
3. If retries exhausted, **abort the mutation** (compensating action) before releasing lock
4. Only then release lock

This ensures the invariant: **lock held → receipt exists** before any other process can acquire.

## Independent Test

A concurrency test that proves the boundary:

```
Test: "no double application under race conditions"

Setup:
- Mock gateway that delays receipt recording by 100ms
- Two concurrent mutation requests with same key

Assert:
- Only one mutation is persisted
- Second request either:
  a) Fails with "mutation in progress", OR
  b) Returns stale read and retries successfully

Mechanism:
- Start mutation A → acquires lock
- Start mutation B → blocks on lock
- Mutation A succeeds → records receipt → releases lock
- Mutation B acquires lock → sees receipt → returns cached result
```

## Questions Before Finalizing

1. Is the lock a distributed lock (Redis/etcd) or local process lock?
2. What's the current receipt storage (file, database, memory)?
3. Should the solution support multiple gateway instances, or is single-instance acceptable?

These answers affect whether we need distributed consensus or can rely on local coordination.
