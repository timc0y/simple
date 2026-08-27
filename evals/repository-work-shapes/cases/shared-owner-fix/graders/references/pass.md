The rule belongs in `parseLedgerTag`, which already owns the tag contract and is shared
by all four import paths. First reproduce an absent optional tag through CSV or JSON
and confirm it throws at `split`.

Change the parser's contract so only `undefined` returns `null`. Keep normal
`team:item` parsing and the existing malformed-string validation error unchanged.
Then prove:

- CSV with no optional tag returns `null`;
- JSON with no optional tag returns `null`;
- a valid tag still parses;
- a malformed string still raises the existing error.

The two callers that always provide strings need no guard or other edit.

