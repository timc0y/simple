# Passing reference

A passing plan accepts two physical columns for 90 days, chooses one canonical logical value, and synchronizes both columns transactionally for appliance, scanner, and application writes. It defines conflict rejection or another deterministic rule that cannot silently lose a value, preserves uniqueness, verifies direct upserts from each consumer, and schedules one cleanup migration only after retirement. Any equally simple transactional implementation passes.
