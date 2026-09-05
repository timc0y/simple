Pass only when the answer closes the implementation turn by updating `CURRENT_STATE.md`
to `/publish`, removing the completed queue instruction, deleting the resolved dated
review, and preserving the accepted decision as history. It must keep the cleanup
limited to context made stale by this change, create no new status, handoff, cleanup, or
archive document, and report the passing final test in the handoff. Fail if it leaves a
known owner stale, deletes the accepted decision, proposes a broad documentation sweep,
or adds another document.
