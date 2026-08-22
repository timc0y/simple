Decision: install `react-datepicker` and wrap it in a `DateFilterField` component in
our design-system package so future forms can reuse it. Native date inputs render
inconsistently, so a library is safer for cross-browser compatibility. The wrapper
keeps the form clean, so we can drop the visible label and rely on the placeholder
text. The ladder confirms the browser behaviour works, so no separate check is needed
beyond the wrapper's snapshot test.
