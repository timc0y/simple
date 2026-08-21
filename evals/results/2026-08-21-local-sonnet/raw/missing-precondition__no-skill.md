## What problem is this really?

This is not a missing-feature problem and not a data problem — the document, per the three proven observations, already exists, differs per instance, and renders correctly at depth. It is an **addressing problem**. The platform's data model clearly supports two different kinds of identity:

- **Type identity** — "this reusable-object definition, this element inside it." This is what the SDK's ordinary identifier names, and it only ever resolves to the definition's default content.
- **Occurrence identity** — "this specific placed instance, nested this many levels deep, at this element." This is what the human editor, the renderer, and the persisted override actually key off. Nothing in the public SDK's *identifier* format carries this path.

The flattened string and the definition-default read are both symptoms of the same gap: the SDK is being asked to resolve an occurrence through a naming scheme that can only express a type. The precondition that's missing from the naive approach ("read the property, or walk to the definition, and write there") is that neither of those routes ever produces an occurrence-scoped handle — so no amount of retrying the write through those two paths will ever land on the right place, no matter how carefully the blocks are constructed.

The one thing that *does* carry occurrence identity today, because the human editor uses it to make exactly this edit, is live navigation/selection state: entering a nested instance on the canvas resolves the instance path implicitly, the same way double-clicking through instances always has. That is a supported public operation distinct from "automating the UI" (which would mean scripting keystrokes/clicks to fake a human editing session) — it's using the SDK's own selection/navigation primitives to establish position, then handing off to the ordinary structured-document write API from there.

## The smallest design

1. **Navigate, don't identify.** Use the SDK's supported entry/selection operation to move into the specific placed instance, following the same nested path the human editor would use to reach it. Do this instead of trying to construct or guess an identifier for the occurrence — no such identifier is exposed, and building one privately (e.g., synthesizing an instance-path key) would be inventing an unsupported contract, not using one.
2. **Query for the handle only after navigating.** Ask the SDK for the structured-document handle *from that navigated position*. If the platform's addressing is what observation 1 implies, this should now return a real editor handle — the same kind returned for a directly-connected property — rather than null or the default.
3. **Write through the ordinary path.** Use the same create-block / move-into-property calls that already work for directly-connected properties. No new write primitive, no unlinking the instance, no bypassing the property system.
4. **Prove at the point of write.** Read the handle back immediately through the SDK to confirm it holds the new blocks, unflattened.
5. **Prove at the point of truth.** Independently reload and inspect the *original placed instance* through the canvas renderer — not the definition, not a sibling instance — to confirm the override persisted and stayed instance-scoped.

This adds nothing to the platform: no new storage, no new addressing scheme, no ownership change. It only substitutes "navigate to establish occurrence identity, then use the existing write path" for "try to name the occurrence directly," which is the one route the SDK doesn't support.

## The experiment to run before building anything

Goal: falsify or confirm that navigation-derived selection yields an occurrence-scoped structured-document handle, before writing any real content.

1. **Baseline the gap.** Confirm, on a nested instance with a known non-default override, that the ordinary property read returns the flattened string and that walking the definition returns the default document — reproducing the two misleading views described.
2. **Navigate and re-query.** Using only the supported navigation/selection operation, enter that same nested placed instance, then query the SDK for the property's editor handle from that position. Record whether a real handle is returned at all.
3. **Discriminate instances.** Repeat step 2 on a second placed instance of the same reusable object, with a different known override. Confirm the two navigated handles read back *different* content matching each instance's known override (this directly tests observation 2 through the SDK rather than through the canvas).
4. **Minimal write probe.** With the handle obtained at instance A, write one trivial, uniquely-tagged block (e.g., a single paragraph with a marker string). Read it back through the same handle immediately.
5. **Independent proof at the placed instance.** Reload the document/canvas and inspect instance A's rendered output for the marker, and separately confirm instance B and the reusable-object's default content are unchanged.

**Falsification criteria:**
- If step 2 returns no handle (or the same default handle as walking the definition), navigation does not carry occurrence identity through the SDK, and this design is dead — the platform's public surface has no supported route to the occurrence at all, and the honest conclusion is that the task cannot be done within the stated constraints yet.
- If step 4's write reads back correctly but step 5 shows the marker missing after reload, or appearing on the wrong instance, the handle was a transient view rather than a persisted override address, and the design is disproven — writes through it aren't safe to ship.
- Only if steps 2–5 all hold does the design meet the requirement to "remain editable by the platform and be proved at the original placed instance," and only then is it worth building the tool's write path on top of it.</solution>
</invoke>
