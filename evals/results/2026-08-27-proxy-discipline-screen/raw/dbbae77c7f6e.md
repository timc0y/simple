Use the existing checkout entry-point budget: fail the production build when its initial gzip payload exceeds 250 KB.

Correct the import so the editor is loaded only when a user opens it, leaving checkout’s initial path free of that dependency. File length and cyclomatic-complexity limits do not measure the failed requirement and would not prevent another oversized dependency from entering the bundle.

Proof:

- Production build reports the checkout initial entry at or below 250 KB gzip.
- Bundle analysis confirms the editor is absent from checkout’s initial chunk and appears only in its deferred chunk.
- Repeat the agreed mobile-session measurement; it meets the load target.

Keep the budget at the product’s explicit 250 KB limit. Reconsider only if the product changes that download budget or checkout genuinely requires the editor during initial load.
