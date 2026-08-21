## Recommendation: don't introduce a service abstraction or queue

Repository facts (`SIMPLE.md`): one local operator, no external consumers, no
compatibility commitments outside the repository, reports generated in-process at
current load, and the report module already owns generation and persistence. The
profile's own reconsideration condition is "measured load or an independent
operational lifecycle requires isolation" — neither has happened.

"Reports will probably grow later" is a future possibility, not an observed need.
That's the first stop condition in Simple: a future possibility is not grounds for a
new concept. Extracting a service layer and adding a queue now would add ownership
boundaries, a new failure mode (queue backlog, delivery/ordering, retry and dead-letter
handling), and operational surface (something to deploy, monitor, and recover) for a
scale problem that hasn't been measured.

### Make the complexity pay rent

```
Observed need:              None measured. "Will probably grow" is speculative.
Existing owner:              The report module (generation and persistence).
Ordinary path:                Generate and persist in-process, as today.
Exact obstruction:          None named — no current request is failing, slow, or blocked.
Missing precondition:        None identified.
Smallest reversible experiment: N/A — no obstruction to route around.
Can the existing owner remain? Yes, unchanged.
New concept or state, only if still required: Not required.
Failure and cleanup states:  A queue adds its own failure states (stuck/lost jobs,
                              ordering, retries) with no current requirement to justify
                              owning them.
Independent proof:           Existing proof already covers this: verify generation and
                              persistence through the report module's public surface.
Reconsideration condition:   Already recorded in SIMPLE.md — revisit when load is
                              actually measured or reports need an independent
                              operational lifecycle (e.g., a separate deploy/scale
                              cadence from the rest of the app).
```

### What to do instead

- Keep report generation and persistence owned by the report module, as it is now.
- If growth is a real concern, establish the missing fact first: measure current
  volume/latency and define the load or lifecycle threshold that would justify
  isolation. That threshold already lives in SIMPLE.md's "Reconsider when" — don't
  duplicate it elsewhere.
- Revisit a service boundary and queue only when that measured threshold is hit, or
  when reports need to be deployed, scaled, or operated independently from the rest
  of the application. At that point the exact obstruction (e.g., "report generation
  blocks the request path" or "reports need independent scaling") will name the
  narrow interface actually needed, rather than a speculative one now.
