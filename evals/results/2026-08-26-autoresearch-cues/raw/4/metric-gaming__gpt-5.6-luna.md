Keep the validation owner intact. Do not extract one-line helpers solely to reduce Oxlint’s number.

Every branch protects a current rule, and the repository has no measured readability or defect problem. Splitting those conditions would add indirection while weakening the single validation owner without improving behavior.

Treat complexity 22 as a review signal, not an automatic refactoring requirement. If the lint rule must be satisfied immediately, use a narrowly scoped configuration or suppression for this owner with a brief reason. Revisit only when the rules form coherent reusable knowledge or real defects show a readability problem.
