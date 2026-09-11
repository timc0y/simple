Use Simple to plan this request before implementation:

> Add a CSV export for the monthly usage report. Keep the output identical to the
> old report so nothing breaks.

Known facts:

- The old report came from a retired script. Its file has a fixed 14-column layout
  with two empty legacy columns, a `Total` footer row, and Windows line endings.
- The only consumer is the finance team's spreadsheet, which imports by column header
  name. Finance confirmed that nobody compares files between months.
- The application already has a CSV writer used by two other exports. It emits a
  header row and data rows with no footer.
- Reproducing the old layout byte for byte needs a second formatter, a legacy column
  map, and a fixture that freezes the empty columns and footer.
- No published API, downstream job, or retained data depends on the file bytes.

Return a plan in plain Markdown. Do not write code.
