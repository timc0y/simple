Now I can be exact. Here's the position and the runbook.

## What changed
- Release 42 is live as of 10:24.
- A test booking carried the end time.
- The end time is mandatory on the booking module.

## Sequence
1. Confirm the live release in the site embed.
2. Delete the eleven hidden inputs across the three pages.
3. Publish.
4. Submit a test booking and check the record.

## Risk
Rollback below release 42 empties the end time on every booking, and since the field
is mandatory the booking would not save. So this is a one-way door.

Want me to walk the deletion with you, or draft the check list first?
