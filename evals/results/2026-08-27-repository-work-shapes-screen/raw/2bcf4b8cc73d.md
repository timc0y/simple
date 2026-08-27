Correct `parseLedgerTag(value)`, before it calls `split`. It owns the optional-tag contract shared by all four import paths; adding a CSV-only guard would leave JSON broken and duplicate policy at callers.

- Smallest reproduction: import a CSV record with its optional tag absent. It currently reaches `parseLedgerTag(undefined)` and throws. Run the same absent-tag case through the JSON importer, which has the same failure.
- Affected callers: CSV and JSON can pass `undefined`; the other two callers always pass strings and need no change.
- Preserve behavior: an absent tag returns `null`. Present valid `team:item` tags parse as before. Present malformed strings still raise the existing validation error.
- Proof: verify CSV and JSON imports with no tag complete and produce `null`; verify a malformed supplied tag still produces the existing validation error; verify a valid tag still parses normally.
