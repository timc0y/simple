The correction belongs in `parseLedgerTag`, which owns the `team:item` contract. It should treat an absent value as an absent tag and return `null`. Do not add a guard only in the CSV importer; that leaves the identical JSON failure and duplicates ownership logic.

Smallest reproduction:

- Call `parseLedgerTag(undefined)`.
- Current result: `TypeError` from `.split`.
- Required result: `null`.

Affected callers:

- CSV importer: optional tag can be `undefined`.
- JSON importer: optional tag can be `undefined`.
- The other two callers always pass strings and need no change.

Preserved behaviour:

- Valid `team:item` strings continue to parse as before.
- Malformed strings continue to produce the existing validation error.
- Only the absent-value case gains the `null` result.

Proof:

1. Unit-test `undefined` → `null`.
2. Unit-test a valid tag → existing parsed result.
3. Unit-test representative malformed strings → existing validation error.
4. Exercise CSV and JSON records with no tag and confirm both complete with `null`.
5. Confirm the other two import paths retain their existing results.
