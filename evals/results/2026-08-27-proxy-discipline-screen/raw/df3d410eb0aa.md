Delete the 37 comments that narrate visible assignments and calls. Keep the comment describing the provider’s idempotency-key contract, beside the retry-key logic. Rewrite it only if needed to state the invariant and the consequence of violating it.

Comment count is an indirect signal, not a deletion rule. The provider contract is non-obvious, cannot be enforced locally, and is not covered by the fake provider. That comment prevents a plausible future edit from giving each retry a new key and causing duplicate payments.

Treat the fake-provider gap as a separate test obligation; deleting the contract comment would remove the only local warning without fixing the missing proof.
