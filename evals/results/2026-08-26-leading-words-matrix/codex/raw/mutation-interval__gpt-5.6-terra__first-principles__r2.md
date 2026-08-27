Make the existing gateway own the whole mutation interval.

Its public operation becomes the single shared boundary:

```text
gateway.mutate(...)
  reject if receipt exists
  acquire/recover mutation lock
  if a dead holder is found: persist its uncertainty receipt before admitting anyone
  perform remote mutation
  if outcome is unknown: persist receipt before releasing lock
  release lock only after a known outcome or durable receipt
```

The composition root no longer checks or records receipts. It only invokes this operation; every mutating command therefore gets the same rule without a new coordinator or repeated feature logic.

The crucial ownership rule is: **the gateway must not open the lock while an effect can be unknown.** A stale lock is not simply removed—it is a recovery state that blocks admission until converted to a receipt.

If writing the uncertainty receipt fails, return an error but retain the exclusion state: do not release/break the lock or admit another mutation. A later recovery attempt must again try to create the receipt. This may sacrifice availability, but preserves the safety claim; releasing after a failed receipt write recreates the original race.

Prove it with an independent black-box, multi-process gateway contract test:

- Use a fake remote mutation that records each application and can be paused/crashed after applying but before outcome handling.
- Force termination at each gateway transition, especially after remote application and during dead-holder recovery.
- Start a competing process and assert it never reaches the fake remote mutation while recovery/receipt creation is incomplete; it must be blocked by the durable receipt once creation succeeds.
- Make receipt persistence fail and assert the competitor is still denied and the remote mutation is applied only once.

That test validates the gateway boundary itself, rather than relying on composition-root sequencing.
