I'll present the answer directly here instead.

## What ships

Nothing resident. Fix the import, keep the one-shot CLI. Delete the daemon prototype once the fix is measured to work.

## Evidence to establish first

The 180ms hasn't been attributed to anything the command actually needs. Before touching architecture:

- Profile cold-start import time (e.g. `-X importtime` or manual timestamps around imports) and show how much of it is the common module pulling in the generator, and the generator pulling in the compiler.
- Confirm the command only reads the generated JSON — that the generator and compiler do no work the command depends on at runtime.

If the import chain accounts for most of the 180ms, the regression is self-inflicted, not a property of the CLI's process-per-command shape.

## Smallest change to test

Break the edge from the common module to the generator. Stop importing the generator to reach a path constant — reference the generated JSON directly, or hardcode the constant, so the compiler is never imported at runtime. This is a dependency cut, not a bundling exercise; bundling is a bigger, unmeasured intervention and shouldn't be reached for before the smaller one is tried.

Prove it the way this repo's SIMPLE.md already specifies: compare cold command latency and behaviour before and after this one change, run through the real CLI entry point — not a unit test of the import graph.

## What becomes removable if it succeeds

Everything the daemon exists to work around:

- The HTTP server, service installation, and service status/recovery commands.
- The second composition root and duplicate route table.
- The parity tests keeping the daemon and direct CLI consistent.
- The lazy route loader added to paper over the duplication.

None of these serve a capability the command grammar requires — they exist only to hide the startup cost. If the cost is gone, so is their reason to exist. One process still composes and executes one command; the daemon was a second path added beside it without a named obstruction the ordinary path couldn't absorb.

## When residency would become justified

Only when a measured capability needs continuity across separate command invocations that cannot be represented as durable data on disk — not "faster starts" in general, since that's addressed by fixing the import. An example that would qualify: state or a connection that must stay warm between commands and can't be reconstructed from stored records fast enough to meet a *demonstrated* requirement. No such capability has been named here. Until one is measured, the daemon has no present obligation to satisfy.
