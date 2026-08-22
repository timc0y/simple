## What problem is this really

It isn't a rich-text problem or a nesting-depth problem. It's an **addressing problem**: the public SDK exposes exactly two ways to reach a document, and neither one is "the override, scoped to this one placed instance, through the chain of objects it passes through."

- Reading the *outer property* walks the **prop-forwarding graph** — a chain of exposed properties passed from wrapper to wrapper — and that path's contract is "return a value," so it collapses structure into a flattened string with separators standing in for paragraph/block boundaries.
- Reading the *definition* walks the **component graph** — which object contains which — and that path's contract is "return what's authored here," which is the default, because the definition has no notion of *which placed instance* is asking.

Neither path is "walk the override/scene graph as this specific instance sees it." But observations 1–3 prove that graph exists and is fully resolved internally: the editor mutates it, different placements diverge in it, and the renderer reads from it at arbitrary depth. So the capability is present in the engine — the SDK's identifier scheme (definition + element) just has no slot for "and which instance-path got you here," so it can't name the address where the override lives.

The reason a directly-connected document *does* get a structured handle is incidental, not architectural: for that case, the element you addressed *is* the node that holds the override, so the two graphs (prop-forwarding and scene/override) happen to coincide at that point.

## The smallest design

Don't go through the property-forwarding path or the definition path at all. Go through the **instance's own node tree**.

A placed instance of a nesting object is not just a bag of forwarded property values — it's a mirror of the internal object tree, materialized as real (overridable) nodes, the same nodes the human editor is actually clicking into when they "edit this one's content." If the public SDK has *any* supported operation to enumerate or select into a placed instance's descendants (the equivalent of expanding it on canvas) rather than reading it through its exposed property, then whatever descendant node directly hosts the document satisfies condition 1 in the prompt at that address: it *is* directly connected to its final document, just reached via a different route than the flattening one.

If such a node is reachable, the existing ordinary write path — create blocks, move them into the property, read them back — is already sufficient. No new capability is needed; you just stop asking the property-forwarding graph a question it can't answer, and ask the scene graph instead, addressed under this specific placed instance rather than under the definition.

## The experiment, before building anything

This is falsifiable cheaply, with reads only — no writes, nothing destructive:

1. Pick two placed instances of the same nesting object, already known (observation 2) to hold *different* override content.
2. For each, enumerate descendants via the instance itself (not via its exposed property, not via the definition) — whatever the SDK's supported child/descendant-traversal call is.
3. For each, find the descendant that is typed as the document element, and check two things at that address:
   - Does opening it for editing return a **structured handle** (not a flattened string)?
   - Does reading it return **that instance's** content, and do the two instances' reads **differ from each other**?

Interpret:
- Structured handle + differing content across the two instances → the hypothesis holds: the scene-graph address is instance-scoped and structure-preserving, so the ordinary write path will land correctly as an override, provable at the original placed instance. Proceed to write.
- Structured handle but **identical** content on both (i.e., both show the definition's default) → the traversal reached the definition-level node in disguise, not an instance-scoped one. Design fails; the SDK genuinely has no address for this, and no legitimate write path exists without one of the disallowed moves.
- No structured handle at all at that address → the flattening isn't about *which graph* you walk, it's tied to the element regardless of path; also falsifies the design.

The key property of this test: it distinguishes "the override is unreachable through the public SDK" from "I've been walking the wrong graph" *before* any write is attempted, using only reads on already-known-divergent instances as the control.
