The correction belongs in `parseLedgerTag`, the shared owner of the `team:item` contract—not in the CSV importer.

- Smallest reliable reproduction: call `parseLedgerTag(undefined)`, or import a CSV/JSON record with its optional tag omitted. It currently throws before validation because it calls `.split(":")`.
- Correct outcome: an absent tag (`undefined`) returns `null`; only then should normal string parsing run.
- Affected callers: CSV importer and JSON importer can supply `undefined`; the other two callers always supply strings and remain unchanged.
- Preserve behaviour: malformed supplied strings—including `""`, missing either side of `:`, or otherwise invalid `team:item` values—must still take the existing validation-error path. Therefore, do not use a truthiness guard such as `if (tag)`: it would risk treating an empty, malformed tag as absent.
- Proof: add/execute focused cases at the parser boundary for:
  - `undefined` → `null`
  - valid `team:item` → existing parsed result
  - malformed strings, especially `""` → existing validation error  
  Then exercise both CSV and JSON imports with an omitted optional tag to confirm neither throws and both receive `null`.

No code was written.
