## Decision

Ship the import fix, not the daemon. The daemon solves a problem that hasn't been shown to require it — SIMPLE.md already establishes that no current capability needs residency, and the regression is process/import startup, not remote execution.

## Evidence to establish first

1. **Attribute the 180ms.** Use an import-time profiler (e.g. `python -X importtime`, `node --prof`, or `strace -T`/`perf` on the process) on a cold command invocation. Confirm the generator → compiler import chain is where the time actually goes, not spread across other startup work. Right now this is stated as a plausible cause, not a measured one.
2. **Baseline cold-start latency.** Time N cold invocations of the current CLI (e.g. `hyperfine`) to get a real before-change number, not just "≈180ms slower" anecdotally.

## Smallest change to test first

Stop the common module from importing the generator to get a path constant. It needs the generated JSON, not the generator or the compiler it drags in. Replace that import with a direct reference to the constant (or a read of the generated JSON path) that doesn't pull the compiler into the process at all. Re-run the same cold-start benchmark and import-time profile against this one change before touching anything else — including bundling, which hasn't been measured and may turn out to be unnecessary once the compiler isn't loaded at all.

If this single import change recovers the 180ms and behavior/tests are unchanged, that's the fix. It satisfies SIMPLE.md's proof line directly: compare cold latency and behavior before/after the smallest dependency change.

## What becomes removable

If the import fix closes the gap, the entire daemon prototype loses its reason to exist and should come out: the HTTP server, service installation, the second composition root, the duplicate route table, the parity tests (they only exist to catch drift between two code paths that no longer need to both exist), the service status/recovery commands, and the lazy route loader (added solely to reconcile the daemon with the direct CLI). That's a second composition root and an ongoing consistency burden, all standing on an unmeasured cause. Removing it isn't cleanup for its own sake — it's removing a workaround once the underlying defect is fixed.

## When residency would become justified

Only if a measured capability needs continuity across commands that can't be represented as durable data — e.g., an expensive-to-establish connection or in-memory state that genuinely can't be persisted between the one-shot invocations a single trusted operator makes. Nothing in the current description meets that bar: completed task records already persist as data, each command does one short remote operation, and the only problem in evidence is import-time weight, which is a startup defect, not a continuity requirement.
