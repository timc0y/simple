# Review: rename `loadAccount` and its three callers

## Verdict

No finding. The change matches the repository's ordinary path and needs no
additional machinery.

## Checks

- **Invented obligations** — None. `SIMPLE.md` states no external consumers, no
  persisted use of the name, and no compatibility commitment for this symbol.
  A rename-in-place has nothing to preserve beyond runtime behaviour and the
  return value, both unaffected by a name change.
- **Divided ownership** — None. One internal helper, three internal callers,
  same owning team. Nothing is moving across an ownership boundary.
- **Second path** — None. The old name is not kept as an alias or wrapper
  alongside the new one; there is one name after the change, matching
  "rename the helper and its three callers directly."
- **Unjustified compatibility** — None needed, and none should be added. No
  deprecation shim, re-export, or transitional alias is justified: there is no
  named consumer outside these three call sites to break.
- **Displaced machinery** — None to remove. A same-behaviour rename leaves no
  old route, config, or state behind.
- **Self-grading proof** — Avoided. The stated proof (tests, type-check, then
  grep for the old name) is independent of the rename itself: it would fail if
  a call site were missed or behaviour changed.
- **Unrelated changes** — Keep the commit to the rename only. Do not fold in
  other cleanup to this helper while touching it.

## Proof to run before merging

- Run the affected tests and type-check.
- Search the repository for the old name (`loadAccount`) to confirm no call
  site, import, mock, or string reference was missed.

## Reconsider when

Only if another repository or a published interface turns out to depend on
`loadAccount`. No evidence of that exists now.
