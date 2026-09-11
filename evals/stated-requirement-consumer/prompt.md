Use Simple to plan this request before implementation:

> Add a CSV export for the monthly usage report. Keep the output identical to the
> old report so nothing breaks.

Known facts:

- The old report came from a retired script. Its file has a fixed 14-column layout
  with two empty legacy columns, a `Total` footer row, and Windows line endings.
- A nightly reconciliation job in another repository reads the file by column
  position, compares it with the previous month's file, and pages an operator when
  the layout changes. That job's owner has no capacity to change it this quarter.
- The application already has a CSV writer used by two other exports. It emits a
  header row and data rows with no footer.
- Reproducing the old layout byte for byte needs a second formatter, a legacy column
  map, and a fixture that freezes the empty columns and footer.

Return a plan in plain Markdown. Do not write code.
