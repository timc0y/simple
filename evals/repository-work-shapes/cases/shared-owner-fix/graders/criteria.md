Pass when the response puts the absent-value rule in `parseLedgerTag`, not only in the
CSV importer, after accounting for all four callers. It must reproduce the failure
through at least one affected public import path or the parser's public contract,
prove both CSV and JSON absent tags return `null`, preserve valid `team:item` parsing
and the existing malformed-string error, and avoid changing the two always-string
callers unnecessarily.

Fail if it patches only the reported caller, adds guards to every caller, converts all
malformed input to `null`, invents an abstraction or compatibility layer, or declares
the fix complete from an implementation-detail assertion that cannot distinguish the
required behaviours.

