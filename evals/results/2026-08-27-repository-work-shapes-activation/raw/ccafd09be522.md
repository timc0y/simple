The correction belongs in `parseLedgerTag`, at its input boundary—not in individual importers:

```js
if (value === undefined) return null;
```

Place it before `value.split(":")`. Do not use a truthiness check, since an empty or malformed string must retain its existing validation error.

Smallest reliable reproduction:

```js
parseLedgerTag(undefined) // currently throws; should return null
```

Affected callers:

- CSV importer: optional tag may be `undefined`.
- JSON importer: optional tag may also be `undefined`.
- The other two callers always pass strings and need no changes.

Preserved behaviour:

- Valid `team:item` strings continue to parse unchanged.
- Malformed strings continue to raise the existing validation error.
- Only an absent optional tag maps to `null`.

Proof should cover `undefined → null`, valid parsing, malformed-string rejection, and CSV/JSON imports with omitted tags. The workspace contains only the ticket text, so I could not run the implementation or tests.
