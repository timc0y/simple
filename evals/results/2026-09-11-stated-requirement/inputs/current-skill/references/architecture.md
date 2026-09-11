# Architecture

Use this when introducing or changing modules, services, ownership, state, or
abstraction boundaries.

## Raptor: simplify the system boundary

SpaceX's Raptor evolution is a useful model for deep modules. Raptor 3 did not make
rocket engineering easy. It internalised secondary flow paths and cooling so exposed
plumbing, engine heat shields, and supporting vehicle hardware could be removed. The
engine became more capable inside and imposed less complexity on everything around
it.

Software simplification should work the same way: put unavoidable complexity behind
one clear owner, then remove the adapters, parallel paths, and support machinery that
the stronger boundary makes unnecessary. Judge the whole system, not the visible
line count of one component.

Sources: [SpaceX's Raptor comparison](https://x.com/SpaceX/status/1819795288116330594)
and [SpaceX's 2026 technical disclosure](https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf).

Use `examples.md` when another engineering precedent would expose the decision more
clearly. A precedent guides attention; it does not supply missing repository facts.

## Find the ordinary path

1. Observe the real system and name the owner.
2. Trace its ordinary successful path.
3. Reduce the exception to the smallest native adapter.
4. Keep policy and validation at the owning boundary.
5. Hide necessary complexity behind a small interface.
6. Prove behaviour through the owner's public surface.

Prefer deep modules over pass-through layers. Keep related knowledge local. Extract
shared knowledge, not incidental syntax. Use linear control flow and explicit state
transitions.

Preserve useful structure and identity through the path. Do not flatten an object,
record or error into a weaker representation only to reconstruct it later. Inspect
the real input, state and output before adding workarounds for an assumed cause.

A valid representation is not yet a usable result. Establish eligibility, access,
and required capability before ranking candidates or reporting success. Verify the
path through the intended caller: an operation that works in a shell may still be
unusable through the client's tool or permission boundary.

Share mechanisms without erasing domain policy. Two values stored identically can
have different lifetimes, absence meanings, or recovery rules. Keep those distinctions
with their policy owner. When a repeated mechanical mistake can be prevented by an
existing schema, constraint, or tool, encode it there instead of repeating prose.

## Shape the domain before the layers

For a new stateful design, sketch the valid states, transitions and one caller before splitting files.
Use a domain model that makes the important distinctions explicit.
A state machine can replace contradictory booleans; a table can replace repeated selection policy.
Neither is necessary for a short operation with one stable path.
Use `types.md` when the type system can remove a real invalid state or caller error.

For a novel, consequential decision with no established answer, compare structurally distinct options.
Include the existing owner or platform solution when viable.
Name what each option removes, what it makes harder and what evidence could reject it.
Use `experiments.md` when a small prototype can settle the choice.
For product work, compare the user's complete experience, including waiting, recovery and accessibility.
Implementation convenience alone does not justify a worse user outcome.

When successive additions cause repeated friction, ask how the design would look with the new requirement present from the start.
Use that answer to find a simpler boundary, not to justify an automatic rewrite.
Preserve existing contracts and move only the part that evidence supports.

These checks adapt PStack's [domain modeling](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-model-the-domain/SKILL.md),
[design-space exploration](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-exhaust-the-design-space/SKILL.md)
and [experience-first principle](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-experience-first/SKILL.md).

## Implementation ladder

Before adding code, a dependency, an abstraction, a workflow, state, or another owner,
stop at the first rung that fully satisfies present obligations:

1. Remove the requirement when no user, contract, retained state, or consequence
   supports it.
2. Reuse the existing owner and ordinary path.
3. Reuse or extend existing repository code locally.
4. Use the language or standard library.
5. Use a native platform capability.
6. Use an already-installed dependency without dividing ownership.
7. Compare a maintained package or existing tool with a direct local implementation.
   Choose the one that leaves less work to own, including integration and operation.
8. Write the remaining product-specific code; add machinery only for a present need.

A package or several can replace thousands of custom lines and remove responsibility
for their implementation. Dependency count alone does not establish complexity.
Check fit, licence, maintenance and runtime support. Upstream maintains its code;
the project still owns integration and updates. Copies and forks become local work.
Prefer supported APIs, configuration and extension points over rebuilding internals.
Use `research.md` when source inspection or a bounded experiment can settle the choice.

Minimise concepts and system burden, not line count. Never simplify away trust-boundary
validation, data-loss prevention, security, accessibility, recovery, real compatibility,
audit obligations, or independent proof.

A metric can locate a problem without explaining its cause. Check the consequence
before you optimise the score. Shorter syntax alone does not remove responsibility.

When a deliberate shortcut has a material limit, record the current choice, why it is
sufficient, its known ceiling, the observable upgrade trigger, owner, and proof. Do not
create a debt ledger for trivial details.

Include the next maintainer, content editor and operator in that comparison. Prefer
defaults when extra choices have no demonstrated value. Remove duplicate facts and
synchronisation duties where one existing owner can serve the consumers. Share code
when consumers need the same maintained knowledge, not just similar syntax.

The ladder draws on [Ponytail](https://github.com/DietrichGebert/ponytail/blob/0a4dd63ad4541f4f655c4108a295916f3c1d8fda/skills/ponytail/SKILL.md).
Simple compares new packages with local code by the maintenance they remove.
Dependency count and diff size do not decide alone. Keep the complete requested behaviour.
A smaller implementation is useful only when it still meets the contract.

Before you choose an interface, sketch one real caller that uses it. Count the concepts,
hidden state and cross-file jumps that caller must understand. A short function can
still impose a difficult protocol; a larger module can remove one. For concurrent
work, separate independently owned state before you add coordination.
Keep a lock or transaction when a real shared invariant needs it.

These checks adapt PStack's [reader-load principle](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-minimize-reader-load/SKILL.md)
and [shared-state principle](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md).

## Make the working path ordinary

Primary and fallback are claims about supported behaviour, not implementation order.
Trace their callers and evidence before changing either. If the primary never works
in the supported environment and the fallback satisfies the full contract, promote
the working path and remove the failed attempt. One failure is not enough evidence.
Fix the primary when its required behaviour is missing from the fallback.

Keep a fallback for a named condition where a normally usable primary cannot finish.
For different environments, prefer explicit capability selection before the operation
when the capability can be established. Do not repeatedly fail to discover a known fact.
Prove each retained path, its trigger and the promised result. Report degraded results
as degraded; empty data, placeholders and swallowed errors are not successful recovery.

After a mutation may have started, establish its effect before another attempt. A
timeout does not prove nothing happened. Reuse an established idempotency mechanism
or reconcile state; otherwise preserve uncertainty rather than duplicate the action.
Record what would retire a temporary fallback, and remove its callers and support
code when that condition is established.

Put fallback, retry and uncertainty checks in the existing shared operation owner.
Make every caller use that owner so no entry point bypasses the checks.

## Preserve the owner; supply the missing precondition

When the desired state already has the right owner but the ordinary path cannot
operate on it:

1. Classify the exact obstruction: ownership, addressability, identity, selection,
   timing, representation, authority, or missing evidence.
2. Ask what single fact would let the ordinary operation succeed unchanged.
3. Test whether a native mechanism can supply that fact temporarily.
4. If it works, decide whether the mechanism should disappear or remain as one
   bounded, owned adapter.
5. Keep the original owner and source of truth unless evidence requires moving them.
6. Prove the result through both the adapter and the original consumer.

Generate counterfactuals before replacing the path: What would have to become true?
Can it be introduced temporarily? Can a native object expose another supported route
to the same state? Am I confusing inaccessible with unrepresentable or wrongly owned?

A second supported address to the same state is not necessarily a second source of
truth. Do not reject a bounded experiment merely because its mechanism would be a
poor universal product design. Unusual solutions require stronger proof, not
automatic rejection: test native acceptance, observation by the original consumer,
survival across removal or reload, repeated use, and contained failure.

## Choose proof that can expose a defect

Derive the expected result from a contract, known example or independent source.
Check whether the proof would reject a plausible wrong implementation. A harmless
internal refactor should not break the check unless the internal interaction is itself
part of the contract. Call order, count, latency and side effects can be such contracts.

Prefer the owner's public surface and real dependencies when practical. Use an
owner-maintained fake or a mock when the contract or environment warrants it. Match
the proof to the consequence; neither an end-to-end test nor a mock is always best.
Make failures report the relevant expected and actual values.

## Make complexity pay rent

Before adding architecture, answer:

```text
Observed need:
Existing owner:
Ordinary path:
Exact obstruction:
Missing precondition:
Smallest reversible experiment:
Can the existing owner remain?
New concept or state, only if still required:
Failure and cleanup states:
Independent proof:
Reconsideration condition:
```

Add an abstraction when cases vary in the same owned knowledge and the boundary
removes complexity from its consumers. A useful design makes the ordinary path
clearer or removes a real obligation elsewhere.

Use an AST for broad syntax-aware transformations. Use a direct patch for local
edits. Preserve unsupported syntax, comments, formatting, and semantic evidence.
