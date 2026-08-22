This is an addressability problem, not a capability problem. The platform already
owns, persists, and renders a distinct structured document per placed instance — the
human editor proves the write path exists. What the tool lacks is only a supported
address: the SDK's identifier names a definition and element with no instance path, so
the ordinary structured-document write path has nothing to aim at.

So the smallest design supplies the missing address instead of building a new
mechanism. The proven observations imply each placed instance retains its own record.
If any natively addressable element can be bound to that same record, the ordinary
write path becomes sufficient: create a temporary hidden native element, connect it
directly to the nested property's per-instance record, and the SDK should return the
same structured editor handle it returns for any direct connection. Write blocks
through that handle, then remove the temporary element. The platform remains the only
owner; nothing is duplicated, moved, or mapped externally.

Experiment before building anything durable, small and reversible:

1. On one disposable test instance, create the hidden native element and connect it to
   the same record that drives the nested property.
2. Write a single distinctive block through the returned handle.
3. Read it back through the API.
4. Verify the canvas renders the new block at the original placed instance, and that a
   sibling instance is unchanged.
5. Delete the temporary element and confirm the document survives its removal.

If any step fails — no handle, readback shows the default content, the render does not
change at the original instance, or deletion destroys the document — the idea is
disproved and no machinery ships. Only if creation, reload, reuse, failure cleanup,
API readback, and original-renderer proof all hold would I retain one idempotently
discoverable hidden adapter per target, with cleanup on failure, as the standing
address.
