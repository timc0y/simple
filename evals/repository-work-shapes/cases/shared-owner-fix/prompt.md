Fix this failure without writing code.

`parseLedgerTag(value)` owns the `team:item` tag format and is called by four import
paths. It currently calls `value.split(":")` immediately. Two import paths can receive
`undefined` for an optional tag; both now throw. The reported ticket covers only the
CSV importer and proposes `if (tag)` around its call. The JSON importer has the same
failure. The other two callers always supply a string. An absent optional tag should
produce `null`; malformed strings should continue to produce the existing validation
error.

State where the correction belongs, the smallest reliable reproduction, affected
callers, preserved behaviour, and proof.

