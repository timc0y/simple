# Single-date filter: implementation decision

## Ladder walk

1. Remove the requirement — no. A demonstrated requirement exists: the form needs a
   single-date filter.
2. Reuse the existing owner and ordinary path — yes, partially. The existing form
   already owns validation and submission; the new field must plug into that path,
   not create a second one.
3. Reuse or extend existing repository code — no date-entry code exists to extend
   (SIMPLE.md: no date-picker dependency or design-system wrapper is installed).
4. Use the language or standard library — not applicable to date entry itself.
5. Use a native platform capability — yes, this rung fully satisfies the obligation.
   `<input type="date">` gives single-date entry, a browser-native picker, and
   built-in keyboard operation, with no added code or dependency.
6–8. Not needed. An installed dependency, a custom local implementation, or new
   machinery would all divide ownership or add complexity the native control already
   removes.

## Decision

Add one native `<input type="date">` field to the existing form as an ordinary
controlled field, wired into the form's current state, validation, and submit
handling exactly like its other fields (same `name`/`onChange`/validation call). No
date-picker library, wrapper component, or new state owner is introduced. The
browser continues to own date entry; the form continues to own validation and
submission — matching the current boundary in SIMPLE.md.

## Preserved safety and accessibility boundaries

- Submission and validation path: unchanged. The date value flows through the
  existing validation function and submit handler like any other field; no parallel
  validation or submission route is added.
- Accessible programmatic label: a `<label htmlFor>` bound to the input's `id` (or an
  `aria-label` if no visible label is used), so the field's purpose is announced by
  assistive technology.
- Keyboard operation: preserved for free — `input type="date"` supports full keyboard
  entry, editing, and navigation (Tab, arrow keys, digit entry) in every supported
  modern browser, with no added script.
- Failure consequence stays bounded: an invalid or unexpected date value can only
  change which records are queried (per SIMPLE.md), not mutate or delete data, so no
  extra trust-boundary or data-loss handling is required beyond existing validation.

## Known ceiling and upgrade trigger

- Ceiling: `input type="date"` handles exactly one calendar date — no range, no time
  component, no timezone control, and limited cross-browser control over the native
  picker's visual styling.
- This ceiling is acceptable now: the task states the product needs one date only,
  with no range, time, or theming requirement.
- Upgrade trigger (from SIMPLE.md "Reconsider when"): revisit this decision only if
  the product later requires date ranges, timezone-aware time selection, or picker
  behaviour the native control cannot provide consistently. Until one of those
  becomes a real requirement, no library or custom picker is warranted.

## Smallest independent proof

- Component test: render the form, set the native date input's value, submit, and
  assert the value reaching the existing submit handler/query matches the selected
  date — proving the field flows through the ordinary path, not a new one.
- Keyboard check: tab to the field and set a date using keyboard input only (no
  mouse), confirming focus lands on the control and the value updates.
- Browser verification at the supported viewport: confirm the native picker opens,
  the label is programmatically associated (visible in the accessibility tree), and
  submitting the form filters records to the selected date.

Do not write the full component; the above is the decision, boundaries, ceiling, and
proof, not an implementation.
