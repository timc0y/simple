Delete the 37 comments that narrate assignments and calls. Keep the idempotency-key comment, placed beside the code that creates or reuses the key, and phrase it as the provider contract it protects.

The count is not the defect measure; unnecessary comments add noise, but this comment prevents a plausible, damaging change: generating a new key for each retry. Because the code cannot enforce the contract and the fake provider cannot detect violations, add provider-backed or contract-test coverage separately. Do not delete the only explanation of that unverified invariant.
