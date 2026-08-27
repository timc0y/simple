Do not extract one-line helpers. Keep the validation owner and its current branches intact: they enforce supported input rules, and no demonstrated readability or defect problem justifies adding indirection.

Treat 20 as Oxlint’s default, not a repository requirement. Choose and record an explicit threshold or a narrowly documented exception for this function while preserving the rules. Reconsider refactoring only if review finds a coherent unit of validation knowledge to own separately, or repeated defects show the function is genuinely hard to maintain.
