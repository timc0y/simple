Keep the router result as a structured record containing `id`, `kind`, `source`, and
`version`. Derive the cache key from all fields that define reconciliation identity,
for example a canonical tuple or encoded object containing `id`, `kind`, and `version`;
keep `source` in the result and include it in the key only if provider-specific cache
entries must be isolated. Migrate the existing router consumers at that boundary. Prove
same-ID/different-kind and same-ID/different-version cases do not collide, and that
operators can still inspect the producing source.
