# Single-date filter — implementation ladder decision

## Implementation decision

Add a native `<input type="date">` as a new controlled field inside the existing
filter form. Wire it into the form's existing state, validation, and submit handler
exactly like any other field — no new submission path, no new validation layer.

Do not introduce a date-picker library, a design-system date wrapper, or a custom
calendar component. The observed requirement is one date, on supported modern
browsers, with no range, no time component, and no theming obligation. The native
control already satisfies all of that, so the ladder stops at the first rung: the
browser is the existing owner of date-entry behavior (per this repository's
`SIMPLE.md`), and no demonstrated requirement exceeds what it provides. Climbing to
a library or a custom widget here would add a dependency, a second date-entry
implementation, and new failure/cleanup states to satisfy needs nobody has stated.

## Preserved safety and accessibility boundaries

- **Ownership stays put.** The browser continues to own date-entry interaction
  (parsing, keyboard behavior, native picker affordance). The existing form
  continues to own validation and submission. The new field is a value source into
  that existing path, not a parallel one.
- **Accessible programmatic label.** The input gets a real `<label>` associated by
  `htmlFor`/`id` (or `aria-label` only if the visual design requires a hidden label);
  its accessible name must match what's visually presented, per the "preserve"
  obligation in `SIMPLE.md`.
- **Keyboard operation.** No custom key handling is added. Tab reaches the field,
  typing or arrow keys adjust the native value, and the existing submit control
  remains reachable and operable by keyboard alone — nothing intercepts or replaces
  native behavior.
- **No new dependency.** Bundle size and supply-chain surface are unchanged; the
  "no date-picker dependency or design-system wrapper is installed" boundary holds.
- **Bounded failure.** An invalid or empty date can only produce a wrong or empty
  filter result. It cannot reach a mutation path, consistent with the stated failure
  consequence ("shows the wrong records but cannot mutate data").

## Material known ceiling and upgrade trigger

**Ceiling:** `<input type="date">` does not support date ranges, timezone-aware time
selection, or fully consistent picker-affordance rendering across all browsers (the
value format and keyboard contract are standardized; the native picker's visual
chrome is not). This is an accepted ceiling, not a defect, because the product needs
exactly one date and targets supported modern browsers only.

**Upgrade trigger (already stated in `SIMPLE.md`, carried forward unchanged):**
reconsider a date-picker library or design-system wrapper only when the product
requires date ranges, timezone-aware time selection, or behavior the native control
cannot provide consistently. Absent one of those, adding that complexity has no
present obligation to pay rent against.

## Smallest independent proof

- **Component test:** entering/changing a date in the field produces the expected
  value on the form's existing submit callback, proving the value flows through the
  current validation and submission path rather than a new one. Assert on the
  public submit output, not on the input's internal state.
- **Keyboard check:** tab order reaches the field, its accessible name matches the
  visible label, and a date can be entered and the form submitted using only the
  keyboard.
- **Browser verification at the supported viewport:** manually confirm in an actual
  supported browser that the native date control renders, opens, and submits
  correctly — this is the layer a test-environment approximation (e.g. jsdom) cannot
  substitute for, since it's the real native picker behavior being relied on.

This proof set exercises the form's existing public submission path and genuine
browser/keyboard behavior, so it can distinguish the requested capability (a working
single-date filter) from the specific implementation used to deliver it.
