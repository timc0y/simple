## What should ship

Nothing from the daemon prototype. Ship a fix to the import chain that causes the
180 ms regression, then measure whether that closes the gap.

The daemon (HTTP server, service install, second composition root, duplicate route
table, parity tests, status/recovery commands, lazy route loader for parity) exists
only to hide startup latency. It was built before the latency was attributed to
anything. The CLI's ordinary path — one process composes and executes one command —
still fits every observed obligation: one operator, one short remote operation per
command, no cross-command continuity requirement. Nothing here needs a second,
long-lived owner. Residency would double the composition root, the route table, and
the test surface to solve a problem that hasn't been shown to require it.

## Evidence to establish first

- Confirm the generator → compiler import chain is the dominant cost: measure
  import/require time for that chain in isolation versus total cold-start time.
  If it doesn't account for most of the 180 ms, the fix below won't be enough and
  the search continues before anything ships.
- Confirm the generated JSON path constant is static per install, not something
  that must be recomputed per invocation. If it's static, the compiler has no
  reason to run, or even be imported, on the ordinary command path.
- Confirm the generator/compiler is otherwise only reached from an explicit
  regeneration path (a build step or an explicit "regenerate" command), not from
  any command in the ordinary path.

## Smallest change to test first

Stop the common module from pulling in the generator (and transitively the
compiler) just to read a path constant. Concretely: either

- move the path constant to its own leaf module with no generator/compiler
  dependency, and have the common module import that instead, or
- read the already-generated JSON file directly where the constant is needed, and
  only import the generator inside the specific function that performs
  regeneration (lazy import, loaded on that rare path, not at module load time).

This is rung 2–3 of the implementation ladder: reuse the existing generated
artifact and the existing module, don't add a dependency or a second owner. No
new abstraction, no bundler, no daemon.

Prove it the way the profile specifies: compare cold command latency and
behaviour before and after this one change, on the same representative commands.
If the 180 ms gap closes (or closes to noise), stop there.

Bundling was suggested but never measured — treat it as a fallback to measure
only if the lazy-import fix leaves a residual, attributed gap. It's a bigger,
less targeted lever than fixing one unnecessary import, and shouldn't be reached
for first.

## What becomes removable if it succeeds

The entire daemon prototype: the HTTP server, the service installation, the
second composition root, the duplicate route table, the parity tests written to
keep it consistent with the CLI, the service status and recovery commands, and
the lazy route loader that was added specifically to reconcile the daemon and
direct-CLI paths. All of that machinery was compensating for a startup cost that
the import fix removes at its source. Once cold-start time is back to baseline,
there is no remaining justification to carry two composition roots or two route
tables for one command surface.

## When a resident process would become justified

Per the profile's reconsideration condition: only when a measured capability
needs continuity across separate command invocations that cannot be represented
as durable data. The existing obligation to keep completed task records readable
after a command exits is already a data requirement, satisfied by files on disk —
it is not evidence for a live process. A daemon would need its own, separately
measured case: for example, a demonstrated need to hold open a connection, cache,
or in-memory state across invocations where rebuilding it per command is shown to
be materially more expensive than the (now-fixed) baseline startup cost. Until
that capability is observed and measured — and only after the current regression
is attributed and fixed, since fixing it removes the daemon's entire original
motivation — residency stays unjustified.
