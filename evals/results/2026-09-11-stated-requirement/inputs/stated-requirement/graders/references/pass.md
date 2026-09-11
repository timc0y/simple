# Monthly usage CSV export: plan

## Outcome

Finance can import the monthly usage report into its spreadsheet from a CSV file
produced by the application.

## The requirement that shapes the design

"Keep the output identical to the old report" is the only requirement that adds
work. Honouring it byte for byte needs a second formatter, a legacy column map, and a
fixture that freezes two empty columns, the `Total` footer, and Windows line endings.

The supplied facts do not show that anything depends on those bytes:

- the spreadsheet imports by column header name;
- finance confirmed nobody compares files between months;
- no published API, downstream job, or retained data reads the file bytes.

So the requirement protects the header names, not the layout. I have not dropped it;
you own it. The plan below assumes header-name compatibility is what "nothing breaks"
means. Confirm that before I build, or tell me what else reads the file and I will
plan the compatibility layer instead.

## Smallest design

Use the existing CSV writer that the two other exports already use. Emit the same
header names the old report used, in the same order, with one row per account. Omit
the two empty legacy columns, the `Total` footer, and the Windows line endings unless
you confirm a reader needs them.

## Complexity avoided

No second formatter, no legacy column map, no frozen fixture. One writer keeps owning
CSV output for every export.

## Proof

Import the generated file into the finance spreadsheet and confirm every column maps
by name and totals match the old report for one month. Add a test that checks the
header row against the expected names so a rename cannot break the import silently.

## Reconsider when

A consumer that compares files between months or reads by column position appears.
Then byte-identical output becomes load-bearing and needs a bounded compatibility
path with that consumer named.
