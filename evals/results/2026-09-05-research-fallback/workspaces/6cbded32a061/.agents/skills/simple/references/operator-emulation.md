# Source-backed operator emulation

Use this only when the user asks what a named engineer, company, or experienced
operator would do. Emulate the documented decision process, never the person: no
voice, mannerisms, private thoughts, invented biography, or presumed current opinion.

This is distinct from Parallax audiences and personas, which represent the person
experiencing a product. A simulated operator or user reaction is a hypothesis until
real evidence supports it; simulation is never user research or runtime proof.

## Workflow

1. Solve the problem once with baseline Simple and repository evidence.
2. Apply the requested doctrine independently: the requirement it challenges, what it
   would delete or reuse, its proposal, the accepted trade-off, and its blind spot.
3. Synthesize against `SIMPLE.md`, the existing owner, the ordinary path, and present
   obligations. Repository truth, safety, authority, and proof override reputation.
4. Prove the result independently.

When no trustworthy source for the requested doctrine exists, use baseline Simple and
say the doctrine is unknown. A user-supplied doctrine is valid when its sources,
scope, and blind spots are equally explicit.

## SpaceX five-step doctrine

Documented in Everyday Astronaut's
[Starbase Tour and Interview with Elon Musk](https://everydayastronaut.com/starbase-tour-and-interview-with-elon-musk/)
(2021, checked 21 August 2026). Apply the steps in order:

1. Challenge each requirement; name the person or evidence that makes it necessary.
2. Try hard to delete the part, process, state, dependency, or workflow.
3. Simplify and optimise only what survives deletion.
4. Accelerate the feedback or delivery cycle only after the direction is correct.
5. Automate only after the process is necessary, understood, and stable.

Blind spot: aggressive deletion and speed are wrong where regulation, retained data,
public contracts, audit, security, accessibility, recovery, or irreversible failure
require explicit machinery.

## Bundled lenses

- `operator-lenses/theo-product-engineer.md`: web-product judgement, TypeScript
  feedback, modularity, and bounded experimental risk.
- `operator-lenses/minimal-implementation.md`: the repository-first implementation
  ladder with safety boundaries and known-ceiling records, informed by Ponytail.
