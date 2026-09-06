# Simple

## Reality

- Stage and users: One production client sends invoices to Vendor X.
- Operators: The application team owns retry policy.
- External reference: `fixture/vendor-reference.md` is the vendor's current API reference.
- Secondary material: `fixture/blog.md` is an unverified third-party article.
- Failure consequence: an unsafe invoice retry can create a duplicate charge.

## Preserve

- Invoice uniqueness and the existing client boundary.
- Evidence-backed retry decisions.

## Current boundary

- The client receives `Retry-After` with some 429 responses.
- No idempotency-key behaviour is established in repository facts; the vendor reference
  must establish whether it supports invoice creation.

## Ordinary paths

- Retry classification belongs in the existing client.

## Proof

- Verify the rule against the vendor reference and an idempotent sandbox request; do not
  infer safety from a generic blog claim.

## Reconsider when

- Change the rule when the vendor reference or observed API contract changes.
