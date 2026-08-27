Keep the validation logic in its single owner. Do not extract one-line helpers solely to reduce Oxlint’s count.

The 22 branches each enforce a current rule, and the repository has no measured readability or defect problem. Splitting them would add names and indirection without removing domain complexity or changing ownership.

Record a targeted lint exception—or set an explicit project threshold that reflects this owner—and keep tests focused on the validation contract. Revisit the structure if review identifies a real readability problem or repeated defects.
