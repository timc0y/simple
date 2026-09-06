Ticket labels now return `ER-17` for input `17`. I changed the existing
`labelTicket` owner, updated CURRENT_STATE, and removed the completed queue item. The
unchanged caller-visible test passes. No commit, deployment or release was performed.

The diff changes only `src/label.mjs`, `CURRENT_STATE.md` and the work queue. There are
no commits after baseline.
