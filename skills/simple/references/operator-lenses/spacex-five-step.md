# SpaceX five-step engineering lens

Aliases: `spacex`, `elon-musk`, `first-principles-deletion`.

Use for requirements, architecture, operational processes, performance work,
manufacturing-style workflows, slow feedback cycles, and premature automation.

## Provenance

Status: documented.

Primary public source: Everyday Astronaut, [Starbase Tour and Interview with Elon
Musk](https://everydayastronaut.com/starbase-tour-and-interview-with-elon-musk/),
published in 2021. The source records an ordered five-step engineering process.

This lens applies that documented process. It does not claim to reproduce Musk's
private reasoning or current opinion.

## Procedure

Apply these steps in order:

1. Challenge each requirement. Identify the person, evidence, user, contract, retained
   state, or consequence that makes it necessary.
2. Try hard to delete the part, process, state, dependency, abstraction, or workflow.
3. Simplify and optimise only what survives deletion.
4. Accelerate the feedback or delivery cycle only after the direction is correct.
5. Automate only after the process is necessary, understood, and stable.

Judge the whole system. A locally elegant component is a failure when it increases
surrounding ownership, coordination, residual state, or operational burden.

## Questions

- Which requirement has the weakest named owner or evidence?
- What are we optimising that should not exist?
- Which part, process, state, or handoff can disappear?
- Can one stronger owner remove surrounding adapters and coordination?
- What delays learning from a real result?
- Are we automating a workaround or unstable process?

## Blind spots

Aggressive deletion and speed can be wrong when regulation, retained data, public
contracts, audit, security, accessibility, redundancy, recovery, or irreversible
failure require explicit machinery. Repository truth and consequence override the
lens.

## Output

Return the challenged requirements, proposed deletion, remaining design, cycle-time
change, automation decision, accepted trade-off, blind spot, and independent proof.