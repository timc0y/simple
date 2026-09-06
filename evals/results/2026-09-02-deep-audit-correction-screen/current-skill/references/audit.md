# Repository audit

Use light crawling agents for bounded evidence collection when they are available and
useful. The audit must also work in the lead agent without delegation. The lead reads
the nearest `SIMPLE.md`, assigns non-overlapping questions, reconciles the results,
and owns every architectural judgement. Read `model-profiles.md` when the host offers
model selection.

Before source, read the repository guides that exist: `README`, `AGENTS.md`,
`CLAUDE.md`, `CONTRIBUTING`, the current-state and work-route documents, and the
decision records relevant to the scope. Treat present-state prose and earlier reviews
as dated claims to verify. Treat decisions and contracts as commitments whose current
applicability must be traced, not as proof of live state.

Use this file for a quick or scoped audit. When the user asks for a deep,
whole-repository, or multi-lens review, also read
[`multi-lens-audit.md`](multi-lens-audit.md). That workflow freezes the initial model,
separates local, live, account, device, and distribution truth, traces the product and
release systems, applies a novelty threshold, and uses independent decision lenses.

## Evidence lanes

1. **Reality:** entry points, packages, deployment targets, stores, public surfaces,
   operation, scale evidence, and failure consequences.
2. **Ownership:** where important state and policy are defined, mutated, orchestrated,
   and cleaned up; report duplicated or circular ownership as observed structure.
3. **Ordinary paths:** trace representative operations from entry point through
   decision, state change, effect, and proof; record forks and bypasses.
4. **Compatibility:** migrations, legacy interfaces, aliases, versions, dual reads or
   writes, flags, and adapters; identify concrete consumers or retained data.
5. **Complexity inventory:** single-use factories and interfaces, registries,
   pass-through layers, internal versioning, generic extension systems, repeated
   representations, and abandoned paths. These are candidates, not violations.
6. **Proof and profile:** tests, builds, type checks, public/runtime checks, and every
   `SIMPLE.md` claim supported, contradicted, or left unknown by repository evidence.

Give each crawler a concrete question and bounded scope. Ask for facts, not an
architecture review. Example: “Find every path that writes AccountState. Return its
file, symbol, caller, storage effect, and whether it uses the ordinary path. Do not
recommend changes.”

## Evidence contract

Normalize each result:

```yaml
finding: Two modules can update account state
status: observed
evidence:
  - path: src/accounts/update.ts
    symbol: updateAccount
scope_checked:
  - src/accounts
limitations:
  - Dynamic plugin loading was not resolved
interpretation: null
```

Use only `observed`, `not_found`, `contradicted`, `unknown`, or `inferred` as status.
`not_found` is not proof of absence. Require file, symbol, command, history, or other
reproducible evidence for material findings.

## Synthesis

The lead agent resolves conflicts, distinguishes code facts from human promises,
decides which complexity pays rent, connects findings across lanes, and states what
requires owner confirmation. Use engineering precedents to test the reasoning, never
as evidence. Before recommending removal, define the independent proof and recovery
appropriate to its consequence.

For a quick audit, inspect the profile, repository shape, obvious ownership seams,
and compatibility inventory. Scope the crawl to the user's target when one is given.
Do not silently escalate a quick audit into the deep workflow.
