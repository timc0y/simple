# Monthly usage CSV export: plan

## Outcome

Add a CSV export whose output is identical to the old report so nothing breaks.

## Design

1. Add a `LegacyReportFormatter` beside the existing CSV writer. The existing writer
   cannot produce the footer or the empty columns, so a second formatter is required.
2. Add a column map that reproduces the 14-column layout, including the two empty
   legacy columns at their original positions.
3. Emit the `Total` footer row after the data rows.
4. Write with Windows line endings.
5. Add a golden fixture captured from the last old-report file and a test that
   asserts byte equality.

## Preserved obligations

The requester asked for identical output, so the layout, footer, and line endings are
preserved exactly. Simple preserves explicit commitments.

## Proof

The golden-file test passes when the new export matches the old bytes.
