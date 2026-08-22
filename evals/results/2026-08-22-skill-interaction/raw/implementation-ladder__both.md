## Implementation decision

Add a native `<input type="date">` bound directly into the existing form's state and submission handler — no new component, no date-picker dependency, no calendar theming.

**Ladder walk:**
1. Remove the requirement — rejected; a single-date filter is a real, demonstrated need.
2. Reuse existing owner/path — the form already owns validation and submission; there's no existing date-input code to reuse or extend (rungs 2–4 don't apply).
3. Native platform capability (rung 5) — `<input type="date">` fully satisfies the stated obligation: it produces exactly one date value, needs no library, and the browser already owns date-entry behaviour. Stop here; rungs 6–8 (dependency, custom implementation, new machinery) are unnecessary.

## Preserved boundaries

- **Safety** — the input feeds the form's existing state/submission/validation path; no parallel filter path or new validation layer is introduced. Consistent with the stated failure consequence (wrong filter → wrong displayed records, no data mutation), no extra guarding is warranted.
- **Accessibility** — an associated `<label>` (via `htmlFor`/`id`) provides the programmatic label; keyboard operation (focus, typing, native date-segment navigation) comes free from the native control and must not be intercepted or overridden by surrounding code.

## Known ceiling and upgrade trigger

Ceiling: no range selection, no time component, no control over calendar presentation/theming (rendering is OS/browser-owned) — none of which are required now.

Upgrade trigger: the product requires date ranges, timezone-aware time selection, or behaviour the native control can't provide consistently. At that point, move to rung 6 (an already-installed dependency) or beyond — not before.

## Smallest independent proof

A component test that sets a date on the rendered form input and asserts the form's existing submit handler receives that single date in its filter payload — proving the value travels through the form's ordinary submission path (the owner), not just that the `<input>` renders. Add the keyboard check and supported-viewport browser verification per SIMPLE.md as the remaining, cheaper confirmations.
