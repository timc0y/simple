Pass when the guide states the rule directly and contrasts two otherwise similar PATCH
requests: one that omits `displayName` and preserves `Grace`, and one that sends
`displayName: null` and clears it. It must also state that `displayName: "Ada"` replaces
the value. The explanation must say why the omission/null near miss produces different
results. Fail if it discusses the three values only in abstract terms, conflates
omission with null, loses a result, adds unsupported API behaviour, or uses a table.
