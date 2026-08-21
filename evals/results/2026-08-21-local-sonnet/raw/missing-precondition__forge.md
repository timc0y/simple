## What problem this really is

This is not a missing write capability. The structured editor handle already writes
and reads back native blocks correctly whenever a property is connected directly to
its final document. The platform also proves, through its own editor and renderer,
that a distinct structured document exists and persists at this exact nested
placement. So the write path works and the state exists. What's missing is a way to
*address* that specific placed instance's override through the public SDK. The SDK's
identifier only names a (reusable-definition, element) pair, which resolves to the
shared definition's default content, not to any one placement's override, and the
outer property reader collapses the same state into one flattened string. This is an
addressability problem, not an ownership or capability problem.

## Existing owner and ordinary path

The platform is the sole owner of the document state, the reusable-object definition,
and the nested renderer, and that must stay true. The ordinary path is: get the
structured editor handle for the property, create blocks, move them into the
property, read them back. That path is already sufficient for directly connected
properties — it does not need to be replaced, only reached from the right context.

## Exact obstruction

Identity and selection. The human editor and the canvas renderer clearly have a
working route to this exact placement (observation 1 and 3 in the prompt), so the
platform's own UI is not limited to the SDK's (definition, element) identifier — it
must resolve placement through canvas/selection context instead. The public SDK
never exposes that context; it only exposes identifier-based lookup, which is why it
sees either the definition's default or a flattened string.

## Missing precondition

A selection- or context-scoped reference to this one placed instance, distinct from
the definition-and-element identifier, so that when the structured editor handle is
requested against that specific context, the property resolves as "connected
directly to its final document" — the override belonging to that placement — instead
of falling back to the shared default or the flattened reader.

## Smallest design

Supply the missing precondition through a supported selection API, nothing else:

1. Select the target placed instance on the canvas or in the object tree using the
   platform's own supported selection operation (reading current selection or
   selecting by supported reference) — not simulated clicks, not UI automation.
2. From that selection context, request the structured editor handle for the
   property, scoped to the current selection rather than looked up by the
   definition-and-element identifier.
3. Use the unchanged ordinary write operations (create blocks, move into property)
   against that handle.
4. Read back through the same selection-scoped handle immediately, and again through
   the original nested renderer after a reload, addressing the same specific
   placement.

This keeps the platform as the sole owner of document state and reuses the existing
renderer and definition unchanged (both required to be preserved). It adds a second
supported *address* to the same state — selection-based instead of identifier-based —
which is not a second source of truth, since it resolves to the platform's own
existing record rather than creating a new one. No unlinking, no flattening, no
automated UI, no private messaging, and no new ownership are introduced.

If selection cannot supply a valid handle at all, this precondition cannot be
supplied natively, and only then does moving ownership become worth reconsidering,
per the case's own reconsideration condition.

## Experiment to prove or disprove before building

1. Using the supported selection operation, select the one placed instance whose
   override is known (from the editor) to differ from the definition's default and
   from any sibling placement.
2. From that selection, request the property's structured editor handle. Disprove if
   this returns null, the flattened string, or the same handle a plain identifier
   lookup would return.
3. Write one distinguishable, novel block through that handle.
4. Read it back immediately through the same handle — confirms the write path
   accepted a selection-scoped target.
5. Reload the document, reselect the same specific placement (not the definition, not
   a sibling instance), and read the property again through both the SDK and the
   original nested renderer. Confirms the write survived as native, editable state at
   the right place, independent of the writing session.
6. Check a second placed instance of the same reusable object still shows its own,
   unchanged override. Confirms the write landed on the one placement's override and
   did not fall through to the shared definition or bleed across instances.
7. Confirm the human editor can still open and edit the written blocks normally in
   the platform UI. Confirms the result stayed native, not a private encoding.

Every step must pass for the design to hold. If step 2 fails, stop: writes must fail
closed rather than fall back to flattening or unlinking, matching the required
failure behaviour. A failure at step 2 is also the only evidence that would justify
reconsidering ownership, since it would show no native address can reach the existing
record.
