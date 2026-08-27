Keep the validation logic in its single owner. Do not extract one-line helpers solely to reduce Oxlint’s score; that adds indirection without reducing real complexity or improving ownership.

Adjust the Oxlint threshold or add a narrow, documented exception for this owner. Revisit the structure only if review or defects show a genuine readability problem, or if the conditions form coherent reusable knowledge.
