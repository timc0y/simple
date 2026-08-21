Don't add a backwards-compatible version. Change the API directly.

Repository facts: one owner uses the internal application; no external consumer is observed; the interface has never been published; there's no persistent production data at stake; there are no compatibility commitments. "Might have external users someday" is a future possibility, not a present obligation — it's the specific case this profile's Reconsider trigger names: add compatibility only when a published client or retained dataset actually depends on the interface. Existing code, or the mere idea of future callers, is not evidence of that.

Building a compatibility layer now means maintaining two paths (old shape and new shape), documenting and testing both, and carrying that cost indefinitely with no named consumer to justify it. That's speculative complexity paying no rent.

What to do instead:
- Change the API in place, through the existing account module (the ordinary path already in use).
- Update its one caller to match.
- Run the account tests and type-check the caller as proof — no separate compatibility surface to verify.

If a real external consumer shows up later, add a bounded adapter at that point, scoped to that consumer's actual contract, with a stated exit condition — not before.