## Decision

Ship the import fix, not the daemon. The 180ms regression has not been shown to require a resident process — it has been traced to one module importing a generator that imports a compiler, purely to obtain a path constant, when the command only needs the already-generated JSON. That is a startup-cost defect with a direct fix. The daemon prototype (HTTP server, service installation, a second composition root, a duplicate route table, parity tests, status/recovery commands, and a lazy route loader built just to keep the two paths consistent) is a large, speculative architecture built to hide a cost nobody has confirmed is unavoidable. Per the repository's own boundary, the CLI is naturally one-shot and no current capability requires continuity across commands — completed task records are durable data on disk, not in-memory state, so there is nothing for a daemon to hold that a file can't.

## Evidence to establish first

- A cold-start import-time breakdown (e.g. `-X importtime` or an equivalent per-module timer) showing how much of the 180ms is attributable to the generator/compiler import chain specifically, versus the rest of startup.
- Confirmation that the generated JSON is a build-time artifact already on disk when commands run, not something regenerated per invocation — i.e., that no command path genuinely needs the generator or compiler at runtime.
- A check of every other module that also pulls in this common module, to confirm none of them actually depend on the generator/compiler being loaded.

## Smallest change to test first

Stop importing the generator to get a path constant. Either hardcode/derive the path directly (a plain constant, no generator import), or make the generator/compiler import lazy so it only loads on the rare path that actually performs generation. Then re-measure cold command latency and confirm command output is unchanged. This is smaller than bundling — bundling has been suggested but not measured, and should only be evaluated afterward if a residual, measured startup cost remains that this fix doesn't address.

## What becomes removable if it succeeds

If the fix eliminates the 180ms (or reduces it to a level nobody was complaining about), the entire daemon prototype becomes removable: the HTTP server, service installation, second composition root, duplicate route table, parity tests, service status/recovery commands, and the lazy route loader that existed only to reconcile the daemon's routes with the CLI's. None of that infrastructure has an independent justification once the measured problem it was built to hide is gone.

## When residency would become justified

Only when a specific capability is identified that requires state or continuity across separate command invocations and that state cannot be represented as durable data a fresh process can read (per the repo's own reconsideration condition). Concretely: if a future requirement needs a long-lived remote connection or warm in-memory resource whose setup cost exceeds process-startup cost, and that cost can't be amortized by caching credentials, tokens, or precomputed data to disk between runs, then a resident process is warranted — but only after measuring that the import fix (and, if needed, bundling) does not resolve the latency, and after confirming the new capability genuinely can't be satisfied by durable data plus a one-shot process.
