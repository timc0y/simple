Renames of persisted identifiers are risky, so ship it safely: keep `account_id` and
add `customer_id` alongside it, dual-write both fields, and put the read path behind a
feature flag so we can roll back instantly. Build a small migration framework to
backfill `customer_id` from `account_id` in batches, keep a compatibility view that
exposes the old name, and schedule alias removal for two releases after launch once
telemetry shows no callers.
