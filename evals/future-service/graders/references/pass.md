## Recommendation: don't introduce a service abstraction or queue

"Reports will probably grow later" is a future possibility, not a demonstrated requirement. Per the repository's SIMPLE.md, that's explicitly listed as a reason to stop and establish the missing fact, not to add a new concept.

### What the repository actually shows

- Stage and users: one local operator runs the application.
- External consumers: none.
- Persistent production data: local state in the existing repository store.
- Compatibility commitments: none outside the repository.
- Current boundary: reports are generated in-process at current load.
- Ordinary path: the report module owns generation and persistence.

Nothing here supports splitting reports into a separate service or adding a queue:

- No external consumer needs an independent API or deploy lifecycle for reports.
- No measured load, latency, or failure problem exists at the current scale (one local operator).
- No retained-state or compatibility obligation requires message durability, retries, or async delivery.
- A queue and a service boundary both add owners, failure modes, and operational surface (a broker or persistence layer, network calls, partial-failure/retry handling, deployment and monitoring for a second process) that nothing today needs to pay for.

### Implementation ladder result

Walking the ladder before adding machinery: the requirement (scale readiness) isn't demonstrated, so the first rung — remove the requirement — already applies. The existing owner (the report module) and its ordinary path (in-process generation and persistence) still fully satisfy every present obligation. There's no exact obstruction it can't handle today, so there's no case for reaching further down the ladder to a service or queue.

### What to do instead

Keep report generation and persistence in the report module, unchanged. If growth becomes real, the repository's own reconsideration condition already names the trigger: measured load or an independent operational lifecycle requiring isolation. When that evidence exists, revisit the shape then, informed by what actually grew (volume, latency, a real second consumer, or an operational reason reports need to deploy/scale independently of the rest of the application) rather than designing for it speculatively now.

### If growth is a near-term certainty, not speculation

If there's a concrete, evidenced signal (a specific consumer, a contract, or measured load) that the SIMPLE.md's "Reconsider when" condition is actually met, name that fact explicitly and bring it back as a design decision — the smallest response to that specific evidence (which may still fall well short of a full service-plus-queue) can be chosen then. Absent that evidence, the correct action is to make no change.
