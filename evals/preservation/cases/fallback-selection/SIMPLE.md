# Fixture facts

This synthetic fixture is a plain Node.js ESM command. `capability.mjs` is the
legacy-only capability probe; it does not constrain the replacement. `supported.mjs` is the working implementation, and
`transient-fallback.mjs` is reserved for a transient supported-path failure.
`legacy.mjs` is intentionally the obsolete failing path.
