## Recommendation: don't do this yet

I'm not going to introduce a service abstraction and queue for reports right now. Based on the repository's actual facts, this would add real complexity to solve a problem that hasn't happened:

- **Stage and users:** one local operator runs the application; there are no external consumers today.
- **Current boundary:** reports are generated in-process, at current load, and that's working.
- **Persistent data:** the existing repository store already handles report state; there's no separate operational lifecycle to isolate.
- **Compatibility commitments:** none outside the repository, so there's no external caller depending on a particular report API shape yet.

"Reports will probably grow later" is speculative — there's no measured load, no queueing backlog, no evidence today that in-process generation is failing or about to fail. A service abstraction plus a queue means: a new process boundary, a message broker or queue backend, retry/dead-letter handling, deployment and monitoring for a second runtime, and a serialization contract between the caller and the service — all before there's a concrete problem that requires it. That's real ongoing cost (more moving parts to build, test, deploy, and maintain) traded for a hypothetical future that may arrive differently than imagined (different growth shape, different bottleneck, different scaling need entirely).

**What I'd do instead:** keep report generation and persistence exactly where they are — owned by the report module, in-process, using the current store. If it helps future flexibility at near-zero cost, make sure report generation is invoked through a single, well-defined function/method (a clear internal seam) rather than scattered inline calls — that's a naming/organization change, not a new architectural layer, and it doesn't add a process boundary, a queue, or new failure modes.

**When to reconsider:** introduce a service boundary and queue when one of these becomes true and is actually observed, not anticipated:
- Measured load shows report generation is slow enough, or frequent enough, to degrade the application it currently runs inside.
- Reports need an independent operational lifecycle — e.g., a separate deploy cadence, separate scaling, separate failure isolation from the rest of the app — because something concrete now requires it (a second consumer, a real throughput problem, a real availability requirement).

At that point, the queue and service split are justified by evidence, and the design can be shaped around the actual growth pattern observed rather than a guess made now. Building it preemptively risks guessing wrong about the shape of the future problem and paying maintenance cost for an abstraction that doesn't fit when the real need arrives.
