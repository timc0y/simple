# Plain developer writing

Use this for plans, documentation, comments, Markdown, prompts, templates, help text,
reviews, progress updates, and handoffs. Writing is a first-class Simple mode; it does
not require an architecture review unless the content itself depends on one.

## Plain writing standard

- Preserve material facts, decisions, constraints, caveats, proof, and next actions.
- Lead with the purpose, outcome, or current state.
- Use one term for one concept.
- Name the actor when responsibility matters.
- Prefer direct constructions and short sentences.
- State concrete conditions, limits, units, ownership, and failure behaviour.
- Separate observed fact, inference, assumption, and unknown.
- Use sentence-case headings and only as many as the document needs.
- Use plain Markdown. Avoid decorative formatting, emojis, icons, callout styling,
  ornamental separators, fake quotations, and visual ceremony unless the destination
  explicitly requires them.
- Use bullets for genuinely parallel items. Keep lists shallow. Do not turn connected
  reasoning into a fragmented checklist.
- Use a table only when row-and-column comparison is materially clearer than prose.
- Use code fences only for code, commands, schemas, or literal machine-readable text.
- Use bold or italics sparingly, only when the emphasis changes how the reader acts.
- Do not add a generic introduction, summary, FAQ, history, or conclusion by habit.

## Match the form

### Comments

Explain a non-obvious reason, contract, invariant, trap, or invalidation condition.
Let the code show the visible operation. Keep the comment beside the rule it protects.

```js
// Retry network failures only; validation failures are permanent.
```

Do not narrate code that is already clear:

```js
// Retry the request when an error occurs.
```

### Plans

Plan the requested outcome, not a generic project. Include only the sections needed to
act safely: outcome, relevant facts, preserved behaviour, steps, proof, risks or
unknowns, and a reconsideration condition when one matters. Use plain headings and
ordered steps. Do not add a roadmap, phases, status table, or ceremony without a real
need.

### Documentation

Lead with what the reader can do or decide. Keep each fact in its owning source. Put
commands, examples, failure behaviour, and recovery guidance beside the task that uses
them. Update the source of truth directly rather than adding another explanatory layer.

### Prompts

State the outcome, relevant context, hard constraints, authority boundary, required
proof, and stop conditions. Avoid repeated instructions and examples that do not fix a
measured failure.

### Reviews, updates, and handoffs

Lead with the outcome or finding. Include evidence that changes confidence, the exact
blocker or remaining risk, and the next meaningful action. State assumptions only when
they can change the solution, and name a blocker with the exact missing authority,
fact, or dependency. Do not narrate routine tool use.

> The migration is unnecessary: the repository has no production data or external
> consumers. I replaced the schema directly and the test suite passes.

For a handoff, report the outcome, why it is sufficient, proof, and any remaining risk
or reconsideration condition. Repeat earlier commentary only when the final state
needs it.

## Editing

Preserve the original meaning before shortening. Remove introductions, repetition,
filler, duplicated headings, decorative formatting, and optional background first.
Compression is successful only when the reader can still decide, operate, recover, or
verify correctly.
