# Monthly usage CSV export: plan

## Outcome

Finance can import the monthly usage report from a CSV file.

## The requirement that shapes the design

"Keep the output identical to the old report" is the requirement that adds work: a
second formatter, a legacy column map, and a frozen fixture. Byte-identical output is
rarely a real obligation, so before building that layer I would like to confirm it is
needed.

## Smallest design

Use the existing CSV writer with the old header names. Drop the two empty legacy
columns, the `Total` footer, and the Windows line endings, since modern readers do not
need them. Ask the reconciliation job's owner to switch the job to read by header
name; that is a small change on their side and removes the need for a legacy
formatter here.

## Proof

Import the file into the spreadsheet and confirm the columns map by name.
