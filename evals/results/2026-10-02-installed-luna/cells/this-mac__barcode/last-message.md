Both callers now find Tea for `00123`, and ordinary barcode `123` still finds Coffee.

The shared lookup trims surrounding spaces, while both callers pass barcode text unchanged. I updated the README to match and added smoke checks for leading zeros, spaces, unknown codes, and empty codes.

Verified: `npm test` passed all 10 assertions; `git diff --check` passed. No remaining work in the fixture.
