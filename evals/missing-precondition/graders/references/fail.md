## What problem is this really

Strip away the domain vocabulary and this is the **prototype/instance override-addressing problem**: a property lookup keyed by *type* (reusable-object definition + element) will always resolve to the shared default, because the identifier space has no slot for *which placement* you meant. It's the same shape as:

- reading a class's field default when you meant a specific object's instance variable,
- resolving a CSS rule's declared value instead of a DOM node's computed value,
- following a symlink to the target's canonical path and losing which link you started from.

Observations 1–3 already prove the per-instance override document is real and stored somewhere the renderer can find it — the renderer *is* proof that a structured node exists at each placement. What's missing isn't the data, it's a **public reference that names a placement rather than a definition**. The "flattened string with invisible separators" and "default content" are two independent symptoms of the same root cause: every public accessor you were handed resolves through the *type* graph, never through the *placement* graph.

So this is not a serialization problem, not a permissions problem, and not something `unlink`/UI-automation "solves" — those all just change which graph you're in (definition-only, or destroy the nesting entirely). The real question is: **does the SDK expose any operation that returns a reference born from placement rather than from definition-lookup?** If yes, the ordinary write path already works once you're holding that reference. If no, this is a genuine missing precondition in the SDK — no legal composition of calls can produce instance-scoped structured access, and the honest answer is "not solvable within the stated constraints," not a workaround.

## Smallest design to test

Don't try to write into the nested property from the outside. Instead, get a reference to the property that never leaves the *placed* tree:

1. Obtain a handle to the top-level placed instance itself (selection, or a parent's child-list — a canvas/placement operation, not a definition lookup).
2. From that handle, descend via the placement's own child/contained-object references (whatever the SDK calls the "what's actually sitting inside this instance" relationship) down to the nested object that owns the document property — never re-entering through the reusable-object's definition ID.
3. At that final step, call the *same* structured-document accessor that works in the direct case, on the node you reached by descent rather than by ID lookup.

If the SDK's "no editor handle" behavior is really keyed on *how you arrived* at the node (via definition vs. via placement), step 3 returns the same structured handle as the unnested case, and the rest is just the ordinary write path: create blocks, move them in, read them back — done at that specific placed instance, invisible to other placements, no unlinking, no UI, no private messages.

## Experiment to run before building anything

Minimal, falsifiable, cheap:

- Confirm the baseline: object B has property P directly connected to its final document → structured handle works (this should already be true per the problem statement).
- Build object A containing one instance of B. Place two instances of A on the canvas, A1 and A2. Give P different content at A1 and A2 (this reproduces observation 2, which you've already got — just keep it as ground truth to check against).
- From the canvas, get a reference to A1 *only* through placement-descent (selection / child traversal), never through "look up A's definition." Walk that reference down into the B-instance inside A1, and call the structured-document accessor on P there.
- **Check the return type.** Structured handle → hypothesis confirmed: the limitation was addressing, not capability. Still a flattened string or the default → hypothesis falsified: the SDK has no placement-scoped accessor for this property at all, and the task as stated has no legal solution — that's the real, honest finding, and it's a gap to report against the SDK, not something to route around with disallowed operators.
- Either way, verify at the end by reading P back at A1 vs A2 and confirming the canvas renders the change only at A1 — that's the proof-at-the-original-placed-instance the task requires.

Run that single probe first. It costs one nested component and two placements, and it will tell you in one step whether "smallest design" means "three lines of traversal" or "this SDK version can't do it."
