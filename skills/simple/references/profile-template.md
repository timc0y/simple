# Repository profile

Use `SIMPLE.md` for local facts that materially change design decisions. Keep it
short enough to inject at session and subagent start.

Init copies the canonical template from `assets/SIMPLE.template.md`. It deliberately
marks the new profile incomplete because a script cannot infer users, production
data, or promises reliably. Establish those facts from repository evidence or its
owner, then remove the incomplete marker and run `scripts/simple.mjs check`.

Before you write, classify each material claim. Use four classes: observed fact, owner
commitment, explicit inference, or unknown. Cite observed facts. Do not ask the owner
for these facts again. Package visibility does not establish users, release stage,
consumers, production data, compatibility, or scale. Files that are not present do not
establish these facts.

For `simple init`, report the evidence first. Then ask only for material facts that
remain unknown:

- Current users and release stage.
- Operators.
- Actual external consumers.
- Published promises.
- Production data that a change must keep.
- Compatibility commitments.
- Current scale and failure consequences.

Ask about current or recent reality. Do not ask about possible future use. Keep the
profile incomplete until the owner corrects or confirms every owner-only fact.

Keep these headings exactly: `Reality`, `Preserve`, `Current boundary`, `Ordinary
paths`, `Proof`, and `Reconsider when`. Give each fact one home:

- `Reality`: current users, operators, consumers, contracts, data, compatibility,
  scale, and failure consequences.
- `Preserve`: only the obligations a change must keep.
- `Current boundary`: the supported state today and its evidence. Express exclusions
  as positive current facts.
- `Ordinary paths`: each owner and existing mechanism, with observable behaviour the
  next agent can rely on.
- `Proof`: commands and independent checks; do not restate the obligation.
- `Reconsider when`: each observable exit or redesign condition, stated once.

When you review a profile, compare every material claim with current repository
evidence. Find unsupported obligations, contradictions, absent paths, vague
preservation or proof, and conditions that you cannot observe. A published surface
proves a contract. It does not prove that an external user exists. Ask the owner when
actual consumers remain unknown. Do not use age alone as evidence of staleness.

If a change makes a profile claim false, update `SIMPLE.md` in the same change. Replace
the old owner. Record the current boundary. Remove fulfilled conditions and expired
preservation duties. Remove proof for behaviour that no longer exists. Do not add
another documentation system unless a present need requires it.

Prefer concrete statements such as:

> The current API serves only this application. Reconsider compatibility when another
> repository or published client depends on it.

Do not write generic principles here; those belong in the skill.
