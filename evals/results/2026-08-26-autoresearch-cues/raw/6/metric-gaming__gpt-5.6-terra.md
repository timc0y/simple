Do not extract one-line helpers to satisfy the metric. Keep all validation branches in the existing owner.

Do not adopt Oxlint’s default complexity limit as a project requirement yet; disable or exempt this rule until the team chooses a threshold based on an actual readability or defect problem. Reconsider a coherent refactor only if review finds separately owned validation knowledge or repeated defects demonstrate that this module is hard to maintain.
