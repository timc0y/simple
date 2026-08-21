## What problem this really is

This is not a storage problem, an ownership problem, or a case for a new write
mechanism. The platform already stores and renders a distinct structured document
per placed instance at any nesting depth — that's proven by observations 1–3. The
real problem is addressing: the SDK's two ordinary read paths both discard the one
piece of information a nested write needs (which placement), so they look like
evidence the node is unreachable when they're really just accessors that project
that dimension away.

- Reading the outer property flattens the structured document into a string —
  it discards structure, not placement.
- Walking the reusable-object definition discards placement, not structure — it
  always lands on the shared default, never the instance's override.

Neither failure means the placed instance's own copy of the document is
inaccessible to the ordinary structured-editor path. It means neither existing
accessor names the right node. The missing precondition is a correct address for
"this property, at this specific placement" — not a new capability, not moved
ownership, not a bypass of the public SDK.

## Where that address already exists

A placed instance is not a pointer to the shared definition; it has its own real
subtree of nodes mirroring the definition's structure, and that is exactly how the
platform can hold different overrides per instance and render them correctly. The
terminal node for the structured property inside that specific instance's own
subtree is a real, addressable object in the public graph — it is simply not the
node either ordinary accessor happens to return.

So the fix is a resolver, not a mechanism: starting from the specific placed
instance (never the definition), walk its own children down the same structural
path that the property override follows, until reaching the node that is this
instance's copy of the final document. That node should be a first-class document
node like any non-nested one, and therefore already eligible for the SDK's ordinary
structured-editor handle — the same handle observation zero (the non-nested case)
proves works.

## Smallest design

One resolver step inserted before the one existing write operator:

1. From the placed instance (not its definition), traverse its own child nodes
   along the structural path implied by the property, matching on structural
   identity (layer order/name), not on the flattened property value and not on the
   definition's tree.
2. At the end of that path, request the ordinary structured-editor handle on that
   specific node — the same accessor already used for a directly connected
   property.
3. If a handle is returned, write blocks through it exactly as the tool already
   does for the non-nested case. No flattening, no unlinking, no UI automation, no
   private protocol messages — one operator, one supported call.
4. If the traversal doesn't resolve to a node, or the returned handle's identity
   doesn't match the intended placement, fail closed. Per the profile's failure
   posture, an unproved write must not happen at all rather than fall back to any
   of the excluded workarounds.

Nothing about ownership, storage, or the reusable composition changes. The
definition, the renderer, and the platform's exclusive ownership of document state
are all preserved untouched — only the address used to reach the write target
changes.

## Experiment to prove or disprove before building

Set up two placed instances (A and B) of the same reusable object, each already
holding a different structured override in the property, both different from the
definition's own default (this is already possible per observations 1–2).

1. From instance A alone (never its definition), traverse A's own child nodes
   along the property's structural path and request the ordinary structured-editor
   handle at the resulting node.
2. Read through that handle. It confirms the resolver if and only if the content
   returned matches A's rendered override — not the definition's default, and not
   B's content.
3. Through that same handle, write one small, identifiable structured edit (e.g.
   insert one distinct block).
4. Save, then reload the document fresh and independently check the canvas
   renderer: the edit must appear only on instance A. The definition's default and
   instance B must be unchanged.
5. Re-read the property at instance A through the SDK's ordinary structured
   accessor (a fresh handle, not the one used to write) to confirm the write
   persisted as native, still-editable structure — not as a flattened string.

If all five hold, the resolver is sufficient and no new mechanism, ownership move,
or workaround is needed. If the handle's content doesn't match A specifically (step
2), or the edit leaks to the definition or to B (step 4), or the readback shows
flattened rather than structured content (step 5), the address theory is wrong and
the platform genuinely has no native path to this placement — at which point the
next-smallest step is to look for a different existing accessor before considering
any change to ownership, per the profile's reconsideration condition.
