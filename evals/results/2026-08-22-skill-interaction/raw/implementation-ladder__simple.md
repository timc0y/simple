I'll present the decision directly here instead.

## Ladder walk (stopping at the first sufficient rung)

1. Remove the requirement — no; a single-date filter is a stated product need.
2. Reuse existing owner/path — the form already owns submission and validation; it's just missing a date field.
3. Reuse/extend local code — no date-entry component exists to extend.
4. Standard library — not applicable to a UI control.
5. **Native platform capability — stop here.** `<input type="date">` wired into the form's existing field/label/validation/submit pattern fully satisfies "one date, no range, no time, no theming."
6–8. Not reached — no dependency, custom implementation, or new machinery is needed once rung 5 succeeds.

## Implementation decision

Add one native `<input type="date">` bound to the form's existing state, validation, and submit path — the same wiring as any other field on the form. No date-picker dependency, no design-system wrapper, no custom calendar markup.

## Preserved boundaries

- **Validation/submission**: the date field flows through the form's single existing validation and submit path — no parallel route.
- **Accessibility**: keep a programmatic label association (`<label for>` or `aria-label`) and native keyboard operability — both are intrinsic to `input[type=date]` and must not be lost by swapping in a non-native widget later.

## Known ceiling and upgrade trigger

- **Ceiling**: native date inputs don't support ranges, timezone-aware time components, or a cross-browser-identical picker UI — the calendar affordance is browser-owned and not stylable.
- **Upgrade trigger**: only reconsider if the product later needs a date *range*, time selection, or a visually/behaviorally consistent picker across browsers. None apply now.

## Smallest independent proof

A component test that sets the date input's value, submits the form, and asserts the value reaches the existing submission path unchanged — plus a keyboard-only check (tab to field, enter/adjust date, submit) at the supported viewport. This exercises the form's own interface, not the input's internals.
