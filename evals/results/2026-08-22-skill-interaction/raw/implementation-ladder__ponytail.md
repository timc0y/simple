**Decision — rung 4 (native platform feature).** A single date is exactly what `<input type="date">` is for; no picker dependency (rung 5) or hand-rolled component (rung 7) is justified. Wire it into the existing form as one more field, no new validation layer:

```jsx
<label htmlFor="filter-date">Date</label>
<input
  type="date"
  id="filter-date"
  name="date"
  value={dateFilter}
  onChange={e => setDateFilter(e.target.value)}
/>
```
This drops into the existing `<form onSubmit>` — same submit handler, same validation path, one extra field in the payload.

**Preserved boundaries**
- Submission/validation: the field feeds the form's existing submit/validate path unchanged — the browser owns date-entry mechanics, the form still owns what happens with the value.
- Accessibility: `label[for]` ↔ `input#id` gives a programmatic name; keyboard focus, arrow-key increment, and typed entry come free from the native control — nothing to reimplement.

**Ceiling / upgrade trigger** — `ponytail: native <input type="date"> has no range, timezone, or theming semantics — it's just a yyyy-mm-dd string. Upgrade to a picker library only when the product actually needs date ranges, timezone-aware time selection, or calendar theming.` That's precisely SIMPLE.md's "Reconsider when" clause — not a hypothetical.

**Smallest independent proof** — one component test: render the form, get the input by its label, fire a change to a known date, assert the value reaches the submit handler untouched, plus a keyboard check (tab to the field, type a date via `userEvent`, same assertion). No new test infra — this is a normal RTL test in the existing suite.

→ skipped: date-picker dependency, custom validation, cross-browser polyfill — add only if the "Reconsider when" trigger fires.
