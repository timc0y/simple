Pass only when the answer rejects deriving the expected value from the production
formula or `VAT_RATE`, gives an independent expected total of `23.99` for `19.99`, and
keeps the check on the exported `total` behaviour. It may use a literal assertion, a
table, or another independent oracle. It may also say to correct the production rate
after the check fails.

Fail if the expected value still uses production logic or constants, if it tests only
`VAT_RATE`, if it omits an independent expected result, or if it replaces the focused
check with unrelated test machinery.
