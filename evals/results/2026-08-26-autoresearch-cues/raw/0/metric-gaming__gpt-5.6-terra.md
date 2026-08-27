Do not extract one-line helpers. The validation owner is the correct place for these rules, and moving them would only hide the same complexity to satisfy an unchosen default.

Keep the function intact. Treat complexity 22 as a review signal, not a defect. If Oxlint must be quiet now, use a narrowly scoped, documented exception for this validation owner while the team chooses a threshold based on real readability or defect evidence.

Reconsider extraction only if the rules form a coherent, independently owned body of knowledge or repeated defects demonstrate that the current function is hard to understand safely.
