# Single-date filter: implementation decision

## Decision

Use the browser's native date control: a plain `<input type="date">`, wired into the
existing filter form as an ordinary field — same name/value plumbing, same validation
hook, same submit handler the other filters already use. No date-picker library, no
design-system date component, no custom calendar UI, no wrapper state beyond what the
form already manages.

Reasoning against the ladder: the stated requirement is one date, nothing else. Every
rung above native HTML (styled native input, headless picker library, full calendar/
design-system component) buys range selection, time/timezone handling, custom theming,
or cross-browser-inconsistency shims — none of which is a demonstrated requirement here.
Climbing there now would be solving problems the product doesn't have yet, on an
internal, modern-browser-only surface with no external consumers and no data-mutation
risk from a wrong value. The native control is the smallest thing that is honestly
sufficient.

## Preserved boundaries

- **Submission and validation path**: unchanged. The date field is a normal form field;
  it enters and leaves through the same validation and submit logic every other filter
  field uses. No parallel state, no new validation framework, no format-conversion layer
  beyond whatever the form already does at submit time.
- **Accessibility**: the input keeps a real, programmatic `<label>` (via `htmlFor`/`id`,
  not `aria-label` standing in for visible text), and keyboard operation is inherited
  free from the native element — tab to focus, type digits or use arrow keys/native
  picker, no custom key handling to build or maintain.
- **Ownership stays where it already sits**: the browser owns date-entry behavior (its
  own picker UI, locale formatting, keyboard interaction); the existing form owns
  validation and submission. This change adds one field, it doesn't move either
  responsibility.

## Known ceiling and upgrade trigger

**Ceiling**: a native `<input type="date">` gives one calendar date with no time
component, no built-in range selection, and no control over the picker's visual
presentation (it's rendered by the browser/OS, not themeable to match a design system).
Older or unsupported browsers can also fall back to inconsistent behavior, though that's
excluded by the stated reality (supported modern browsers only).

**Upgrade trigger**: reconsider — i.e., climb to a headless date-picker library or
design-system date component — only when one of these becomes an actual, demonstrated
requirement, not a speculative one:
- the product needs a date **range**, not a single date;
- the product needs **timezone-aware time selection** alongside the date;
- the product must guarantee **consistent behavior on a browser** that doesn't support
  the native control well.

Until one of those is real, adding a picker dependency is solving an imagined future
problem at the cost of a new dependency, more surface to theme, and a validation path
that no longer matches the rest of the form.

## Smallest independent proof

- **Component test**: renders the filter form, asserts the date field has an accessible
  name (label association), sets a value, submits, and asserts the existing
  validation/submission handler receives that value in the same shape as the other
  filters — no new test harness or picker-specific test utilities required.
- **Keyboard check**: tab into the field, confirm it receives focus and that a value can
  be entered/changed using only the keyboard (typing digits or native arrow-key
  increment), with no custom key handler to verify beyond what the browser already does.
- **Browser verification**: manually confirm the native picker opens and a date can be
  selected and submitted at the one supported viewport the app targets — not a matrix of
  browsers or viewports, since none beyond the supported set is in scope.

This is proof sized to the change: it confirms the field is wired correctly and stays
inside the existing form and accessibility boundaries, without inventing test coverage
for range, timezone, or theming behavior that was never built.
