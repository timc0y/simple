Update [SIMPLE.md](/tmp/simple-repository-work-shapes/workspaces/9f3bdadd4ba4/SIMPLE.md) to reflect:

- `ApiBoundary` now owns request parsing and response serialization.
- The compatibility transition is complete: the old field alias is removed and only the new field is supported.
- The old 90-day promise and zero-traffic measurement are recorded as the removal evidence.
- The proof remains `npm test`.

No new migration or compatibility documentation is needed; the existing compatibility context should be replaced, not retained as current behavior.
