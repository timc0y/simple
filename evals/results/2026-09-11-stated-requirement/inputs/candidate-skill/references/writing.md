# Plain developer writing

Use this for plans, documentation, comments, Markdown, prompts, templates, help text,
reviews, progress updates, and handoffs. Writing is a first-class Simple mode; it does
not require an architecture review unless the content itself depends on one.

## Plain writing standard

- Preserve material facts, decisions, constraints, caveats, proof, and next actions.
- Start with the reader's question. Give the answer, outcome, or current state first.
- Group reasons and evidence under the point they support. Do not make the reader build
  the argument from scattered facts.
- Use one term for one concept.
- Name the actor when responsibility matters.
- Prefer direct constructions and short sentences.
- Prefer a concrete example or before-and-after account when abstract prose is hard to
  picture.
- When readers could confuse two cases, show a nearby case where the answer changes
  and explain the decisive fact.
- State concrete conditions, limits, units, ownership, and failure behaviour.
- Separate observed fact, inference, assumption, and unknown.
- Instructions describe what to do, not what has happened. A check, deployment or
  recovery command does not establish whether it has run or what state exists now.
- Use sentence-case headings and only as many as the document needs.
- Use plain Markdown. Avoid decorative formatting, emojis, icons, callout styling,
  ornamental separators, fake quotations, and visual ceremony unless the destination
  explicitly requires them.
- Use bullets for genuinely parallel items. Keep lists shallow. Do not turn connected
  reasoning into a fragmented checklist.
- Use a table only when row-and-column comparison is materially clearer than prose.
- Use the smallest useful visual when it makes a flow, hierarchy, relationship, or
  state change materially easier to understand. A short text flow is often enough.
- Use code fences only for code, commands, schemas, or literal machine-readable text.
- Use bold or italics sparingly, only when the emphasis changes how the reader acts.
- Do not add a generic introduction, summary, FAQ, history, or conclusion by habit.

## Match the form

### Comments

Explain a non-obvious reason, contract, invariant, trap, or invalidation condition.
Ask which plausible wrong edit the comment prevents.
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
need. Show how each step removes an observed obstruction and recheck the plan against
the original problem before presenting it.

### Documentation

Lead with what the reader can do or decide. Keep each fact in its owning source. Put
commands, examples, failure behaviour, and recovery guidance beside the task that uses
them. If the reader must understand a sequence or branch, show that shape before the
detail. Update the source of truth directly rather than adding another explanatory
layer.

For an explanation, show one concrete input through its decisions, state changes and
result. Explain the reason for a surprising boundary when evidence establishes it.
Link the source that proves the behaviour. A file inventory alone does not explain
the mechanism. This adapts [PStack's how workflow](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/how/SKILL.md).

For a tutorial, teach through a complete example. For a how-to, give the steps for the reader's task.
For reference material, make facts easy to retrieve. For an explanation, develop the mechanism and its reasons.
Use the reader's purpose to choose the dominant form; separate forms when mixing them obscures the task.
This adapts PStack's [technical-writing guidance](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/technical-writing/SKILL.md).

For “explain that more simply,” restate the same claim and limits in familiar language.
For “teach me,” start with a concrete mental model and expand to the requested depth.
Connect how the system behaves with why it exists only where historical evidence supports the reason.
Use a diagram when it reduces explanation work; do not replace a requested walkthrough with a brief verdict.
These forms adapt PStack's [bro](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/bro/SKILL.md)
and [teach](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/teach/SKILL.md) workflows.

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

When you reject or defer a material review finding, explain the decision and its
decisive fact or trade-off. Keep a non-obvious reason in the existing owner when later
work needs it; the reply alone may suffice for a routine resolution.

## Editing

Preserve the original meaning before shortening. Remove introductions, repetition,
filler, duplicated headings, decorative formatting, and optional background first.
Compression is successful only when the reader can still decide, operate, recover, or
verify correctly.

## Adapt to the audience

Keep the facts, commitments, and boundaries fixed while changing the detail and action
for the reader.

Use the destination's conventions. Controlled technical English can help operational
instructions; do not impose it on narrative or persuasive prose at the cost of purpose.

Before: “The destination schema is stale. The operator can refresh it and rerun the
import.”

After for an operator: “The destination schema is stale. Refresh it, then rerun the
import.”

After for a reviewer: “The destination schema is stale. The operator can refresh it
before rerunning the import.”

Before: “The current endpoint remains available during the documented migration window.”

After for a user: “You can keep using the current endpoint during the documented
migration window while you update.”

After for a reviewer: “The current endpoint remains available during the documented
migration window.”

Do not turn an audience adaptation into a new promise. If the source does not state a
window, guarantee, or supported caller, preserve that uncertainty.
