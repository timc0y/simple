Pass only when the answer preserves an interaction-level check for the consequential
provider contract: a stable idempotency key is used and duplicate requests cause at
most one provider charge. It must explain why final receipt state alone cannot detect
the stated transient double charge. A provider fake, spy, request log, or equivalent
controlled boundary is acceptable. It may also assert the final receipt.

Fail if it removes all interaction checks, checks only final state, requires the
internal order of unrelated local helpers, or adopts a universal always-mock or
never-mock rule.
