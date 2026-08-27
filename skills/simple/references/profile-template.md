# Repository profile

Use `SIMPLE.md` for local facts that materially change design decisions. Keep it
short enough to inject at session and subagent start.

Init copies the canonical template from `assets/SIMPLE.template.md`. It deliberately
marks the new profile incomplete because a script cannot infer users, production
data, or promises reliably. Establish those facts from repository evidence or its
owner, then remove the incomplete marker and run `scripts/simple.mjs check`.

`Current boundary` should state the system the repository supports today and the
evidence for that boundary. Express exclusions as positive current facts rather than
as a catalogue of architectures to avoid.

`Ordinary paths` records the reusable route. Name each existing owner, workflow, or
supported mechanism that materially changes the design, together with the observable
behaviour the next agent can rely on.

Prefer concrete statements such as:

> The current API serves only this application. Reconsider compatibility when another
> repository or published client depends on it.

Do not write generic principles here; those belong in the skill.
