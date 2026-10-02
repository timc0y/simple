The CLI now returns Tea for `"00123"` through the existing lookup. It was converting barcode text to a number, which removed the leading zeros.

I expanded the smoke checks to cover both callers: `"00123"` with and without surrounding spaces returns Tea; `"123"` still returns Coffee; unknown and empty codes return `null`. `npm test` passed all 12 assertions. The README now describes the shared behavior.
