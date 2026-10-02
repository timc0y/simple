The web and CLI now return Tea for `00123`. The shared lookup trims surrounding spaces, and both callers pass barcode text through unchanged, preserving leading zeros.

I verified both callers with the smoke command: all 10 assertions passed, covering `00123`, ordinary barcodes, surrounding spaces, unknown codes, and empty codes returning `null`. `git diff --check` passed.
