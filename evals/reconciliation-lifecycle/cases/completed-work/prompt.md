Finish this implementation turn and give the smallest complete handoff. The source and
tests now replace the internal `/draft` route with `/publish`, and the final test run
passed.

Repository evidence says:

- `CURRENT_STATE.md` is the sole present-tense status owner and still calls `/draft`
  current.
- `docs/plans/README.md` is the sole ordered queue and still lists "replace `/draft`
  with `/publish`" as unfinished.
- `docs/decisions/0004-draft-origin.md` is an accepted decision recording why `/draft`
  originally existed. Accepted decisions remain as history unless superseded.
- `docs/reviews/2026-07-route-review.md` requested this exact replacement. It owns no
  retained evidence or current contract. Git is the archive.
- There are no external consumers, retained records, or compatibility promises for
  `/draft`.

The user asked for the route change, not a documentation audit. State which repository
changes belong in this turn and what the handoff should report. Do not invent further
work.
