Fixed the mismatch through the shared lookup: it trims surrounding spaces, while the CLI now passes barcode text through unchanged. The README reflects the shared behavior.

Verified both callers return Tea for `"00123"` and `" 00123 "`, Coffee for `"123"` and `" 123 "`, and `null` for unknown and empty codes. The existing smoke command passed all four assertions, and `git diff --check` passed.