I'll analyze this distributed systems problem by first exploring the codebase to understand the current implementation.This is a distributed systems design problem. Let me analyze the current boundary and propose the smallest ownership change.Based on the analysis, here's the plan for the smallest ownership change:

---

## Analysis

**Current problem:** The lock owner (gateway) and receipt owner (composition root) are separate. This creates two race windows:

1. **Race 1:** Lock released → new process starts → acquires lock → old mutation's uncertainty not yet recorded → duplicate
2. **Race 2:** Lock holder dies → new process starts → no orphan check → blocks forever or duplicates

**Smallest ownership change:** Make the gateway the single owner of both lock acquisition AND uncertainty recording. Move "record unknown result" inside the gateway, before lock release.

## Proposed Sequence

```
composition root: convert orphaned lock to receipt (startup only)
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record unknown result (if needed)  ← MOVED
gateway: release lock
```

**Why this is minimal:**
- One ownership change (move receipt recording into gateway)
- One startup safety step (orphan detection)
- No new coordinators, no repeated checks per feature

## Failure Path: Recording Uncertainty Fails

If recording uncertainty fails after mutation is performed:

1. Do NOT release the lock
2. Leave the orphaned lock in place
3. On restart, orphan detection converts it to a receipt
4. Next process sees the receipt and does NOT re-apply

This preserves the invariant: "No new mutation while any prior effect is unknown."

## Independent Test Proving the Boundary

**Test 1 (Race 1 kill):**
- Process A acquires lock, performs mutation
- Kill A AFTER mutation, BEFORE recording uncertainty
- Process B starts → converts orphaned lock to receipt → does NOT re-apply mutation
- Assert: mutation applied exactly once

**Test 2 (Race 2 orphan):**
- Process A acquires lock, perform mutation, kill A while lock held
- Process B starts → blocks on lock → orphan detection runs → converts to receipt → unblocks → does NOT re-apply
- Assert: mutation applied exactly once

**Test 3 (recording failure):**
- Process A acquires lock, performs mutation
- Force recording uncertainty to fail
- Assert: lock NOT released
- Process B starts → converts orphaned lock → does NOT re-apply
- Assert: mutation applied exactly once

---

This is a design-only analysis. I cannot make edits in plan mode. Would you like me to implement any part of this, or do you have questions about the approach?
