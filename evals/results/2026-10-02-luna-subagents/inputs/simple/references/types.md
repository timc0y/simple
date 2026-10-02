# Types and trust boundaries

Use this when types, state representations or input validation can prevent an actual caller error.
Preserve the repository's language and authoritative schemas.
Do not introduce a type framework merely to apply this reference.

Parse untrusted data at its entry boundary into the domain's supported representation.
Reuse the existing schema library or parser when available.
Keep business decisions independent of the transport where that removes repeated policy or simplifies proof.
Keep transport and effect adapters thin without scattering one operation across pass-through files.
Validate again when trust, provenance or mutability changes; static types cannot prove current external state.

Choose representations from the operations they must support:

| Observed problem | Useful representation | Limit |
| --- | --- | --- |
| Contradictory status fields | Explicit variants with associated data | One derived status can be simpler than a state machine |
| Two identifiers are accidentally interchanged | Distinct domain types or named arguments | Do not brand every primitive without a caller risk |
| An operation cannot accept an empty sequence | A validated nonempty sequence | A total sum still accepts an empty sequence |
| New variants silently bypass a handler | Exhaustive matching | Unknown external values still need boundary handling |
| A hand-written shape drifts from a protocol | Schema-derived types | Runtime data still needs validation |

A start plus a duration does not ensure a valid range if negative or non-finite durations remain possible.
Prove numeric constraints at construction rather than assuming a renamed field enforces them.
Strengthen a type where a real operation would otherwise be partial; stop when the added precision buys no useful protection.

In TypeScript, treat external values as `unknown` until validation establishes their shape.
Use discriminated unions for meaningful variants and `never` checks for exhaustive handling.
Use schema inference or existing type utilities before copying another owner's interface.
Prefer `satisfies` when checking an object against a type without an assertion is the actual need.
A type assertion does not perform runtime validation; a custom type guard must check the claim it makes.
Keep an unavoidable assertion narrow and record the external guarantee that justifies it.

Use the repository's diagnostics to report operation identity and relevant failure state.
Keep secrets out of diagnostics. A CLI can use standard output as its public interface;
a service should use its established structured logger when available.

Adapted from PStack's [boundary discipline](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-boundary-discipline/SKILL.md),
[type-system discipline](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-type-system-discipline/SKILL.md)
and [TypeScript guidance](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/typescript-best-practices/SKILL.md).
