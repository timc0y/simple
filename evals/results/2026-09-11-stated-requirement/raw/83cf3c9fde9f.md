# Plan

## Outcome

Add a monthly usage CSV export that preserves the finance spreadsheet’s import contract: the expected column headers, usage values, and any required 14-column structure. Do not require byte-for-byte compatibility unless finance confirms that the footer or Windows line endings affect import.

## Relevant facts

- The retired report used 14 columns, including two empty legacy columns, a `Total` footer row, and Windows line endings.
- Finance imports by column header name and does not compare monthly files.
- The application already has a CSV writer used by two exports, but it emits only headers and data rows.
- No public API, downstream job, or retained data depends on the file bytes.
- The exact historical header names and the fields finance still imports must be recovered from the retired script or an existing report sample.

## Preserved behaviour

- Monthly usage data and its existing meanings.
- Header names required by finance.
- Any legacy columns that finance’s import actually requires.
- CSV escaping and quoting supplied by the existing writer.
- A stable export entry point within the application’s existing reporting path.

The old footer and Windows line endings are not byte-level compatibility requirements based on the known consumers. Preserve them only if testing or finance confirms that the spreadsheet import depends on them.

## Implementation steps

1. Inspect the retired script, archived output, or finance’s import template to establish the authoritative headers, field order, and required fields. Record any unavailable historical detail as an explicit unknown.
2. Route the monthly usage report through the existing CSV writer.
3. Configure the export with the confirmed report columns and headers. Include the two empty legacy columns only if they are required by the import contract or are needed to retain the established logical layout.
4. Keep the writer’s ordinary header-and-data-row behaviour. Do not add a second formatter solely for the old line endings or footer.
5. Add a fixture or focused test for the finance-facing contract: headers, column mapping, representative values, empty legacy fields if retained, CSV escaping, and total usage calculation.
6. Add an integration-level check that generates a monthly report through the normal application entry point and verifies that finance’s spreadsheet importer accepts it.

## Complexity avoided

- No byte-for-byte legacy formatter.
- No Windows-specific line-ending path.
- No footer machinery unless an actual consumer requires it.
- No compatibility layer for a published API or downstream file consumer.
- One CSV implementation remains responsible for CSV encoding.

## Proof

The export is complete when:

- The generated header names match the confirmed finance import contract.
- Each imported field maps to the correct monthly usage value.
- Empty legacy columns, if retained, remain empty.
- CSV values containing commas, quotes, or line breaks are encoded correctly.
- The generated file is accepted by the spreadsheet import check.
- The test would fail if a column were renamed, remapped, omitted, or populated incorrectly.

## Risks and reconsideration

The main unknown is whether the `Total` footer, exact 14-column order, or Windows line endings are operationally required despite finance’s stated header-based import. If finance’s import rejects the ordinary output, add only the smallest report-specific extension to the existing writer—such as optional footer rows or line-ending configuration—and cover that requirement with a fixture.
