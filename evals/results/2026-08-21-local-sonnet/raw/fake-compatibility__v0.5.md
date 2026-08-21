Don't add backwards compatibility for this change. Change the account behaviour directly through the existing module.

## Why

Repository facts (SIMPLE.md):
- One owner uses the internal application; the interface has not been published.
- No external consumers are observed.
- No persistent production data.
- No compatibility commitments exist.
- The ordinary path is to change account behaviour through the existing module, which one application calls directly.

"This API might have external users someday" names a future possibility, not an observed requirement. Simple's stop condition applies directly: *a future possibility is the reason for a new concept*, and *existing code is the only evidence for compatibility*. There is no published client, no external consumer, and no retained data that a compatibility layer would protect. Building one now would add a second path (old version + new version) beside the ordinary path, with no named consumer to justify it — that's the "second path beside the ordinary path" and "adapter has no named consumer" stop conditions as well.

A compatibility layer here would be pure speculative cost: more surface to maintain, more states to test, and a false signal to future readers that an external contract exists when none does.

## What to do instead

1. Change the account module's behaviour in place — no versioned/parallel API, no adapter, no deprecation shim.
2. Update the one calling application to the new behaviour directly.
3. Prove it the way the profile already specifies: run the account tests and type-check its callers. That's an independent enough surface to distinguish correct behaviour from the implementation.

## When to reconsider

Per the profile's reconsideration condition: add compatibility only when a published client or a retained dataset actually depends on the interface. If a real external consumer shows up, that's the trigger to design a compatibility layer around its actual, named contract — not before.
