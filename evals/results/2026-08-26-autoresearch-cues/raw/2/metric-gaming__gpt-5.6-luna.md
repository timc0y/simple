Keep the validation owner intact. Do not extract one-line helpers solely to reduce Oxlint’s count; that moves syntax without reducing domain complexity and separates rules from their owner.

Add a narrowly scoped, documented Oxlint exception for this owner at complexity 22, while keeping the default limit for the rest of the repository. Verify the existing validation tests.

Reconsider only if review finds a readability problem or defects recur. Then extract coherent validation knowledge or use a data-driven structure—not arbitrary helpers.
