# Minimal implementation lens

Aliases: `lazy-senior`, `ponytail-style`, `implementation-ladder`.

Use immediately before writing code, adding a dependency, or introducing another
abstraction, workflow, state store, or owner.

## Provenance

This lens is informed by the public MIT-licensed [Ponytail
project](https://github.com/DietrichGebert/ponytail) and its [agentic benchmark
method](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/agentic/README.md).
Ponytail is not bundled, invoked, or credited as having run. The sources were checked
on 21 August 2026. Simple retains its own repository-first method and proof boundary.

## Decision rule

Use the single implementation ladder in [architecture](../architecture.md).
Do not apply a second ordered ladder: local implementation is not necessarily
simpler than a maintained dependency. Compare concepts and total work to integrate,
verify, operate and maintain, including the existing owner's capabilities.

Minimise concepts and system burden, not line count. Do not assume fewer lines
also mean fewer reasoning tokens, tool calls, elapsed time or cost; measure on
the intended model, harness and workload.

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
