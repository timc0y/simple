# Comments and documentation

Use this when creating or substantially changing comments, Markdown, prompts,
templates, help text, or internal technical prose.

## Preserve

- contracts and externally observable behaviour;
- invariants code cannot express;
- exact limits, units, ownership, and failure behaviour;
- non-obvious reasons and plausible rejected alternatives;
- operational, recovery, and security knowledge;
- prompts, fixtures, snapshots, templates, and error text when wording is behaviour.

## Avoid

- narrating visible code;
- repeating one fact in several files;
- history already recoverable from Git;
- reports that only describe work just completed;
- headings, summaries, and examples that do not change a decision or action;
- appending new guidance instead of correcting the source of truth.

Comments explain why:

```js
// Retry network failures only; validation failures are permanent.
```

Not what the next line already says:

```js
// Retry the request when an error occurs.
```

Lead documents with the result. Put detail beside the decision or task that needs
it. Use one term per concept. Separate fact, inference, and unknown. Preserve
precision before reducing length.
