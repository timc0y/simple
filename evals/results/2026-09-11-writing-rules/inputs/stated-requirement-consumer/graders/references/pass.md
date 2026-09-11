# Monthly usage CSV export: plan

## Outcome

The nightly reconciliation job keeps reading the monthly usage report without paging
an operator, and finance keeps receiving the file.

## The requirement that shapes the design

"Keep the output identical to the old report" is load-bearing. The reconciliation job
reads by column position and compares each file with the previous month's, so any
change to the 14-column layout, the empty legacy columns, the `Total` footer, or the
line endings pages an operator. Its owner cannot change it this quarter. The
requirement stays.

## Design

Keep the existing CSV writer as the owner of ordinary exports; do not change it for
the other two exports. Add one bounded legacy formatter for this report only, with the
column map, empty columns, `Total` footer, and Windows line endings. Name the
reconciliation job in a comment beside the formatter as the consumer it exists for.

## Exit condition

Remove the legacy formatter and switch this export to the ordinary writer when the
reconciliation job reads by header name or retires. Record that condition where the
job's owner will see it.

## Proof

Generate one month with the new formatter and run the reconciliation job's own
comparison against the previous month's old-script file. Keep a fixture captured from
the old script and assert byte equality so a future edit cannot break the layout
unnoticed. A passing unit test alone is not proof; the job's comparison is.

## Complexity accepted

One extra formatter and one fixture, bounded to one consumer with a named exit. The
plain writer would be simpler and should replace this path once the job changes.
