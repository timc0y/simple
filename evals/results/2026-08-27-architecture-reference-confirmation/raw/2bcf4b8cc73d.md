The correction belongs in `parseLedgerTag(value)`, the owner of the `team:item` contract. It should treat `undefined` as an absent optional tag and return `null` before parsing. Do not add a CSV-only guard: that would leave the JSON path broken and split the contract across callers.

The smallest reliable reproduction is a direct call to `parseLedgerTag(undefined)`. It currently throws from `split`; the corrected result is `null`. This isolates the shared failure without depending on importer setup.

Affected callers:

- CSV importer: optional absent tag must import as `null`.
- JSON importer: same optional absent-tag behaviour.
- The other two callers: unchanged; they always pass strings.

Preserve existing behaviour:

- Valid `team:item` strings parse exactly as they do now.
- Malformed strings still reach the existing validation and raise its existing error.
- Only an absent optional value (`undefined`) changes, from an accidental runtime exception to `null`.

Proof should include direct parser coverage for `undefined → null`, a malformed string producing the existing validation error, and importer-level checks showing both CSV and JSON records with an omitted tag complete with `null`.
