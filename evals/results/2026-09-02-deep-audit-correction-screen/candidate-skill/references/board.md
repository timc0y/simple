# Decision board

Use a board for a consequential decision that has more than one plausible answer, a
material unknown, or competing obligations. Do not use it for a routine reversible
change, an objective question that tools can answer, or work with one clear owner and
ordinary path.

Subagents are optional. Use them only when the host supports them and an independent
view could change the decision. The workflow must still complete without delegation.

## Prepare the decision

Give every reviewer a short evidence packet:

- the decision and required outcome;
- observed facts, explicit commitments, and material unknowns;
- the current owner and ordinary path;
- the options or provisional answer when that reviewer should see them;
- the consequence of being wrong and the available independent proof.

Use audit evidence when it already exists. If facts are missing, use the bounded
evidence lanes in `audit.md` before asking agents for opinions.

## Select the smallest useful board

- **Scout:** light, read-only extraction from a bounded scope. It reports facts and
  limitations, not a design opinion.
- **Independent solver:** medium judgement with fresh context. It receives the problem
  and evidence but not the lead's provisional answer.
- **Challenger:** medium judgement. It receives the provisional answer and tries to
  falsify its assumptions, ownership, consequences, and proof.
- **Consequence reviewer:** medium judgement for one demonstrated concern such as a
  public contract, retained data and rollback, security or privacy, operations and
  recovery, user outcome, or maintainability. Do not invent a stakeholder or concern
  to fill a seat.
- **Adjudicator:** heavy judgement only when a material disagreement survives an
  evidence check or the decision is difficult to reverse.

One independent solver is enough for a second opinion. Add another view only when it
can expose a different failure consequence. Do not ask several agents the same broad
question or treat agreement as independent evidence.

## Run and synthesise

Give reviewers fresh context when the host permits it. Let reviewers share the
evidence packet, not one another's conclusions. Keep reviewers read-only; the lead
retains the user's authority boundary and owns any synthesis or edits.

Ask each reviewer for:

```text
Verdict:
Decision-changing evidence:
Assumption or unknown:
Likely failure mode:
Smaller alternative:
What would change this view:
```

The lead resolves differences through repository evidence, explicit commitments, and
discriminating proof. Do not use majority vote or average self-reported confidence.
Report the recommendation, strongest material dissent, remaining unknowns, and the
check that would distinguish the chosen answer.

If delegation is unavailable, apply the same views sequentially in the lead context.
State that the reviews were not independent. Do not block the task or pretend that a
self-review supplied independent confirmation.

Read `model-profiles.md` to route each role by current host capability. Model names are
examples, not requirements.
