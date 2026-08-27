Recommend one guardrail: configure the existing bundler’s checkout entry-point budget to fail at 250 KB gzip.

Correct the cause by removing the editor import from the checkout entry. If the editor is needed elsewhere, give it a separate or lazy-loaded entry; checkout must not download it.

Proof:

- The production checkout artifact is at most 250 KB gzip.
- The bundle report confirms the editor is absent from checkout.
- Checkout behavior and any editor route still pass their tests.
- A measured mobile session meets the agreed load target.

File-length and cyclomatic-complexity limits would add maintenance noise without enforcing the violated contract.
