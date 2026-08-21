# Source-backed operator emulation

Use this when the user asks what a named engineer, company, team, or experienced
operator would do, or when a documented operating doctrine could expose a better
solution.

Operator emulation is not personality role-play. Emulate the public decision process,
not the person's voice, confidence, mannerisms, politics, private thoughts, or presumed
current opinion.

## Boundary

Simple operator lenses emulate the problem solver: how an engineer or team challenges
requirements, chooses a design, audits code, or communicates a decision.

Parallax audiences and personas represent the person experiencing a product and are
used to review rendered UX, UI, access, trust, and task completion. Do not turn an
operator lens into simulated user research. A simulated reaction is a hypothesis until
real product evidence or research supports it.

## Evidence states

Classify lens material as:

- `documented`: directly stated in a public primary or authoritative source;
- `repeated`: consistently visible across several attributable sources or projects;
- `inferred`: a bounded interpretation of documented decisions;
- `uncertain`: too weak to guide the decision;
- `stale`: may no longer represent the current operator or organisation.

Record the source and date. Do not promote inference to documented fact. Prefer a named
doctrine such as `spacex-five-step` over claiming to know what a person would decide
now.

## Activation and persistence

Operator lenses are opt-in per task. Apply one when the user requests it or explicitly
asks for an operator comparison. Do not silently add a famous operator to an ordinary
Simple design, writing, audit, or review task. Do not persist a lens into later tasks
unless the user or repository contract explicitly keeps it active. When no trustworthy
source exists, use baseline Simple and state that the requested doctrine is unknown.

## Workflow

1. Solve the problem once with baseline Simple and repository evidence. Do not expose
   the baseline to the operator lens when an independent pass is possible.
2. Select the smallest relevant lens. Use `role + doctrine + problem`, not a broad
   company stereotype.
3. Set the influence level:
   - `consult`: report what the lens notices and would challenge;
   - `challenge`: produce an independent counterproposal before synthesis;
   - `enforce`: use the doctrine as the primary procedure, while repository truth,
     safety, authority, and proof still override it.
4. Run the lens independently. Require the challenged requirement, proposed removal or
   reuse, solution, accepted trade-off, evidence needed, and likely blind spot.
5. Ask where the lens is wrong for this repository. Preserve real users, contracts,
   retained data, recovery, security, accessibility, and irreversible consequences.
6. When useful, run a contrasting lens without sharing the first lens's conclusion.
7. Synthesize the useful parts against `SIMPLE.md`, the existing owner, the ordinary
   path, and present obligations. Do not choose a proposal because of the operator's
   reputation.
8. Prove the resulting design independently. Simulation and emulation generate
   hypotheses and tests; they do not prove runtime behaviour.

## Output

Use only the sections the decision needs. A complete emulation may include:

- baseline problem and repository facts;
- selected lens, influence level, provenance, and limitations;
- requirement challenged;
- what the lens would delete, reuse, or preserve;
- independent proposal and accepted trade-off;
- known ceiling and observable upgrade trigger;
- the lens's blind spot or conflict with repository truth;
- Simple synthesis;
- independent proof and remaining unknowns.

Write in plain Markdown. Do not perform an impression or write in the operator's voice.

## Bundled lenses

- `operator-lenses/spacex-five-step.md`: requirements, deletion, simplification,
  cycle time, and automation order.
- `operator-lenses/theo-product-engineer.md`: web-product simplicity, modularity,
  type feedback, and developer experience.
- `operator-lenses/minimal-implementation.md`: repository-first implementation ladder,
  safety boundaries, and explicit upgrade triggers.

A user-supplied lens is valid when its sources, scope, principles, blind spots, and
output contract are equally explicit. Start from `operator-lenses/TEMPLATE.md` rather
than inventing a personality prompt.
