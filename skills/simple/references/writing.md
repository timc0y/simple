# Plain developer writing

Use this for plans, documentation, comments, Markdown, prompts, templates, help text,
reviews, progress updates, and handoffs. Writing is a first-class Simple mode; it does
not require an architecture review unless the content itself depends on one.

## Plain writing standard

Use these defaults for choices the requested operation leaves open. A limited edit or
exact output requirement takes precedence over a preferred opening, structure, or style.

- Preserve material facts, decisions, constraints, caveats, proof, next actions, and
  the relationships between them.
- Start with the reader's question. Give the answer, user-visible outcome, or current
  state before the mechanism when choosing the opening is part of the task.
- Group reasons and evidence under the point they support. Do not make the reader build
  the argument from scattered facts.
- Use one term for one concept. Use only terms the reader or their client has already
  used; introduce any other term with its plain meaning in the same sentence.
- When reporting a change to a number, label, field, or wording, use a before-and-after
  pair when it helps the reader understand the change.
- Keep the reply on the active request, including accepted context and unaffected
  requirements. Put unrelated findings on one line marked as not acted on. Give each
  action you chose yourself its reason in terms of the reader's goal.
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
- Show no more than five items per group, ranked by consequence, and count or name
  what is held back. This shapes presentation only: it never limits analysis, search,
  tool results, or what you retain, and it never omits an item when completeness
  matters.
- Use a table only when row-and-column comparison is materially clearer than prose.
- Use the smallest useful visual when it makes a flow, hierarchy, relationship, or
  state change materially easier to inspect. A short text flow is often enough.
  Consider interaction when the reader needs to change an input, or animation when
  seeing motion or timing helps answer the question. Keep decisive evidence and
  uncertainty visible in every form.
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

Lead with the outcome or finding. For a question whether something is safe, correct,
or okay to do, the first sentence is the verdict: safe now, not safe until a named
condition, or the reader's decision with its reason. Include evidence that changes
confidence, the exact blocker or remaining risk, and the next meaningful action.
Put the decisive observation beside a consequential claim so the reader can check it
without reconstructing the investigation. Keep supporting detail in its existing
owner; retain any fact that changes the reader's decision in the reply.
Report a failure as location, expected and actual, cause, fix, in that order and
without alarm words. State what ran and what was only read or looked at; reading a
script or inspecting an output is not running it, and a check that did not run did
not pass. State assumptions only when
they can change the solution, and name a blocker with the exact missing authority,
fact, or dependency. Attach uncertainty to the affected claim and missing observation:
"The deployment has not been checked" is more useful than general doubt. An error
that stopped does not establish a fixed cause, and a successful tool call establishes
only what that operation checked. Do not narrate routine tool use.

> The migration is unnecessary: the repository has no production data or external
> consumers. I replaced the schema directly and the test suite passes.

For a handoff, report the outcome, artifact and target, last verified state, first
unproved step, remaining risk, and who owns the next action. Preserve existing
authorization and any effect whose result is still unknown. Explain why the evidence
supports the claimed outcome and what would change the conclusion. The receiver checks
the relevant artifact and mutable state before continuing; acknowledgment alone does
not verify them. Use the parts the handoff needs rather than a fixed template. Repeat
earlier commentary only when the final state needs it.

When you reject or defer a material review finding, explain the decision and its
decisive fact or trade-off. Keep a non-obvious reason in the existing owner when later
work needs it; the reply alone may suffice for a routine resolution.

## Editing

Choose the operation from the user's request. Do not make the human select a mode
when the conversation already establishes it.

| Requested operation | What may change |
| --- | --- |
| Explain | Develop the same claim and its reasons at useful depth; preserve conditions and uncertainty. Simpler need not mean shorter. |
| Shorten | Remove introductions, repetition, filler, duplicated headings, decoration and optional background before material reasoning or actions. |
| Punctuation only | Change punctuation within the requested passage; preserve words, their order and the document structure. |
| Light edit | Keep useful sentences and structure; fix the requested issue. |
| Restructure | Move supplied material while preserving causal links, emphasis, exceptions, prerequisites and citation attachment. |
| Compose | Build from the brief and source. Ask only for necessary missing substance; do not invent it. |

Use the smallest change that fulfils that operation. Keep already-good wording when
changing it would not help. An unchanged draft that leaves the requested defect
unresolved is not a completed edit. Compression succeeds only when the reader can
still decide, operate, recover or verify correctly.

### Check the request and source

Before relying on the draft, derive the few decisive questions from the request and
authoritative material: what must this reader understand or do, and what would make
the answer misleading? Use the source including explicitly approved corrections;
a factual correction belongs to that task, not a universal writing rule. Separately
supplied facts may govern the task. A later mention alone does not supersede an
authoritative source: resolve consequential conflicts from the user’s stated
authority, ask when that authority is unclear, and preserve unaffected requirements.
Later style edits must not restore an approved factual error.

Check once, then repair identified failures and recheck the affected passages:

- Does the result fulfil the requested operation, purpose and exact constraints?
- Source to draft: did a material fact, reason, condition, exception, action or unknown
  disappear? True remaining sentences do not establish completeness.
- Draft to source: is each added claim supported? Keep who does what, to whom, when,
  under which condition and with what certainty. Names and numbers alone cannot prove
  those relationships; a possibility must not become a promise.
- After moving or cutting text, do long-range exceptions still apply and do citations,
  quotations and code remain attached to the same claims? Check exact requirements
  directly; judge meaning separately from wording similarity.

Stop when the requested result is complete. Do not run an open-ended polishing or
self-scoring loop. Keep detailed checks out of the response unless requested; ask
the human only when missing substance prevents a truthful answer. This is an agent's
fallible review, not independent proof or a required answer template. Fidelity to a
source does not establish that the source itself is true. Preserve an unknown answer
unless new evidence resolves it.

For example, “Maya may send Lee the two files after approval” can become “After
approval, Maya could send both files to Lee.” Swapping Maya and Lee keeps the names
and quantity but changes responsibility; removing approval loses a condition.
Preserve domain terms and identifiers when they carry meaning; explain them rather than removing the fact to satisfy a style preference.

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
