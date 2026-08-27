Correct `parseLedgerTag(value)`, the owner of the optional `team:item` input contract. It should return `null` when `value` is `undefined`, before attempting `split(":")`. Do not add a CSV-only guard: JSON has the same optional input and would remain broken.

Smallest reliable reproduction: call `parseLedgerTag(undefined)` and assert `null`, rather than a thrown `TypeError`.

Affected callers:

- CSV importer: optional tag can be `undefined`.
- JSON importer: optional tag can be `undefined`.
- The other two import paths: always pass strings; no caller change is needed.

Preserve existing behavior for every supplied string: valid `team:item` values parse as before, and malformed strings still produce the existing validation error.

Proof: add or run focused tests for `undefined` returning `null`, a valid tag parsing normally, and representative malformed strings retaining the validation error; run both CSV and JSON imports with an absent optional tag.
