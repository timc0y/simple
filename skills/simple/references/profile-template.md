# Repository profile

Use `SIMPLE.md` for local facts that materially change design decisions. Keep it
short enough to inject at session and subagent start.

Setup may identify files and proof commands, but it cannot infer users, production
data, or promises reliably. Establish those facts from repository evidence or its
owner. Do not convert uncertainty into deletion permission.

```markdown
# Simple

## Reality

- Stage and users:
- Operators:
- External consumers:
- Public contracts:
- Persistent production data:
- Compatibility commitments:
- Scale and failure consequences:

## Preserve

- Hard-won domain, operational, security, or recovery knowledge.

## Does not need yet

- Specific speculative architecture, with the observed reason it is unnecessary.

## Ordinary paths

- Existing owner or workflow agents should reuse.

## Proof

- Commands and independent surfaces that verify changes.

## Reconsider when

- Observable condition that would justify more complexity.

## Precedent: concise name

Need:

Tempting complexity:

Observed fact:

Simple solution:

Why sufficient here:

Reconsider when:

Concepts avoided:
```

Prefer concrete statements such as:

> No backwards-compatible API yet: there are no external consumers. Reconsider when
> another repository or published client depends on it.

Do not write generic principles here; those belong in the skill.
