Read this case's `SIMPLE.md` and design the smallest change to the fallback result
representation.

The router currently returns a record with `id`, `kind`, `source`, and `version`. A
proposal replaces it with the string `source:id` so both providers can share one cache
key. Downstream reconciliation needs to distinguish records with the same `id` and
`kind` from different versions, and operators need to know which provider produced a
result. Explain the representation, cache-key rule, migration or compatibility impact,
and proof.
