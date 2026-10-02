The CLI now preserves barcode text, and the shared lookup trims surrounding spaces. Both callers return Tea for `00123` and Coffee for `123`; the README now describes that behavior.

`npm test` passed all 10 smoke assertions. I also checked both callers with `00123`, `123`, a space-padded code, an unknown code, and an empty code. Their results matched in every case, including `null` for unknown and empty inputs. `git diff --check` passed.
