“Safe-to-repeat” is informal wording and does not require an API alias. Keep the public
`refresh` endpoint and its idempotency-key contract; inspect the existing path and add
the smallest documentation or regression check needed. Repeat one keyed request and
verify one effect and a stable response.
