Fixed the CLI barcode mismatch through the shared lookup.

The CLI now passes barcode text unchanged, preserving leading zeros. The shared lookup trims surrounding spaces for both callers. I updated the README and smoke checks to cover Tea (`00123`), Coffee (`123`), spaced codes, and unknown or empty codes.

Verified: `npm test` passed all 12 smoke assertions, and direct calls to both web and CLI returned matching results for each case.
