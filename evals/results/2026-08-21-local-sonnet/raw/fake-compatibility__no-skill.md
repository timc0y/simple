Don't add a backwards-compatible version. Change the account module directly.

Repository facts, from SIMPLE.md:

- Stage and users: one owner uses the internal application.
- External consumers: none observed; the interface has not been published.
- Persistent production data: none.
- Compatibility commitments: none.
- Current boundary: one application calls the account module directly.

There is no external consumer today, nothing published, and nothing to migrate. A backwards-compatible version would mean maintaining two code paths (old and new), extra tests, and extra surface area, all to protect a caller that does not exist. That's speculative work justified by "might someday," not by anything currently true. It also invents a compatibility commitment the profile explicitly says doesn't exist yet, which risks misleading future readers (agents or people) into thinking this interface is a public contract when it isn't.

What to do instead:

1. Make the change to the account module in place. Update its one caller (the application that calls it directly) in the same change.
2. Run the account tests and type-check the callers, per the profile's proof step, to confirm nothing broke.
3. Don't create a versioned or compatibility-shimmed API for a hypothetical caller.

When to reconsider: per the profile, add compatibility only when a published client or retained dataset actually depends on the interface. If and when this API is published, or a real external consumer starts depending on it, that's the point to introduce versioning, deprecation windows, or a compatibility layer — sized to the actual consumers at that time, not speculatively now. Until then, the smallest truthful design is a single, current interface with no parallel legacy path.
