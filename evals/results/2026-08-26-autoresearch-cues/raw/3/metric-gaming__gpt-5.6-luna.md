Keep the validation owner intact. Do not extract one-line helpers solely to reduce Oxlint’s count.

Every branch protects a current input rule, and there is no measured readability or defect problem. Splitting the conditions would move related validation knowledge away from its owner and add indirection without reducing system complexity.

Treat 22 as evidence for choosing the repository’s complexity threshold, not as an automatic refactoring requirement. Configure or narrowly exempt this owner if CI requires it, with the reason recorded. Reconsider extraction only if review or recurring defects show a real readability problem; then extract coherent validation knowledge, not individual conditions.
