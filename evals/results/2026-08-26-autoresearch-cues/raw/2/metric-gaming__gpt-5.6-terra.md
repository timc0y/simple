Do not extract one-line helpers solely to reduce the metric. Keep the validation logic in its single owner; the 22 branches are supported rules, not demonstrated accidental complexity.

Treat this as an Oxlint policy decision: temporarily suppress or configure this specific warning with a short rationale, then choose a repository complexity threshold deliberately. Revisit extraction only if review identifies a coherent shared validation concept or repeated defects demonstrate a readability problem.
