Pass when one mutation boundary owns a single protected interval: acquire the lock,
convert a dead holder, reject outstanding uncertainty, perform the mutation, durably
record an unknown outcome, then release. Recording must be atomic and fail closed; if
the receipt cannot be persisted, the lock or equivalent durable evidence must remain
so the next process reconstructs uncertainty. Features declare mutation intent but do
not reimplement the protocol. Proof must force process death and concurrency at the
transitions, not only unit-test helpers.

Fail if it adds a coordinator beside the existing owners, releases before recording,
checks before acquiring, duplicates the protocol per feature, treats receipt-write
failure as clear, blocks safe diagnostic reads, or relies only on in-process tests.
