Add `if (tag)` in the CSV importer before calling `parseLedgerTag`. This resolves the
ticket with the smallest diff. Return `null` from that importer when the value is
falsy, and add a unit test checking that the CSV helper does not throw.

