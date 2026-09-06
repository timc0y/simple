Read this case's `SIMPLE.md`. Explain the domain state model and the smallest handling
rule for the lookup. Distinguish an absent record from an expired record and say what
the caller should observe.

The profile service looks up an account by ID. A missing account has never existed; an
expired account existed but is past `expires_at`. The proposal maps both cases to
`null` and lets callers infer the reason from the current time.
