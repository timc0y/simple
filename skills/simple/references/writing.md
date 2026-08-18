# Comments and documentation

Use this when creating or substantially changing comments, Markdown, prompts,
templates, help text, or internal technical prose.

Use the established conventions of the document's field. For operational and
instructional English, apply ASD-STE100-style discipline where useful: one term per
concept, direct constructions, explicit actors, short sentences, and concrete
conditions. The model already knows the standard; do not reproduce its rulebook.
Do not force controlled English onto prose whose purpose is persuasion, narrative,
or natural conversation.

## Keep prose that carries

- contracts and externally observable behaviour;
- invariants code cannot express;
- exact limits, units, ownership, and failure behaviour;
- non-obvious reasons and plausible rejected alternatives;
- operational, recovery, and security knowledge;
- prompts, fixtures, snapshots, templates, and error text when wording is behaviour.

Let code show its visible operation. Keep each fact in its owning source. Add a
heading, summary, example, or history only when it changes a decision or action.
Update stale guidance directly.

Comments explain why:

```js
// Retry network failures only; validation failures are permanent.
```

The code already expresses this operation, so it needs no comment:

```js
// Retry the request when an error occurs.
```

Lead documents with the result. Put detail beside the decision or task that needs
it. Use one term per concept. Separate fact, inference, and unknown. Preserve every
material fact, decision, caveat, and next step; remove introductions, repetition,
generic reassurance, and optional background first.
