# Minimal implementation lens

Aliases: `lazy-senior`, `ponytail-style`, `implementation-ladder`.

Use immediately before writing code, adding a dependency, or introducing another
abstraction, workflow, state store, or owner.

## Provenance

This lens is informed by the public MIT-licensed [Ponytail
project](https://github.com/DietrichGebert/ponytail) and its [agentic benchmark
method](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/agentic/README.md).
Ponytail is not bundled, invoked, or credited as having run. Simple retains its own
repository-first method and proof boundary.

## Ladder

Stop at the first rung that fully satisfies present obligations:

1. The requirement can be removed.
2. The existing owner and ordinary path already solve it.
3. Existing repository code can be reused or extended locally.
4. The language or standard library solves it.
5. The platform provides a native capability.
6. An already-installed dependency solves it without divided ownership.
7. One direct local implementation solves it clearly.
8. Only then add a new abstraction, dependency, workflow, service, state store, or
   owner.

Minimise concepts and system burden, not line count. A compact implementation that
loses a real obligation is not simple.

## Never simplify away

- validation at trust boundaries;
- prevention of data loss or duplicate irreversible effects;
- security and privacy controls;
- accessibility requirements;
- recovery and malformed-state behaviour;
- real compatibility, audit, or regulatory commitments;
- the smallest independent proof of consequential behaviour.

## Known ceiling

When selecting a deliberate bounded shortcut with a material limit, record:

```text
Current choice:
Why it is sufficient now:
Known ceiling:
Observable upgrade trigger:
Owner:
Independent proof:
```

Do not add a debt note for trivial implementation detail. Record only a ceiling that
could change a future decision or operation.

## Output

Return the first rung that holds, displaced machinery removed or avoided, preserved
safety boundaries, known ceiling when material, and smallest independent check.