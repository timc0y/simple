## Decision

Ship the existing one-shot CLI. Do not ship the resident daemon or bundling yet.

The known regression is startup/import overhead, not a required remote operation. The simplest likely cause is the common module importing a generator—and transitively a compiler—only to access data already present in generated JSON.

## Evidence to establish

- Cold-start latency distribution before and after the change, including a representative command.
- An import profile proving the generator and compiler load during startup.
- That the generated JSON is available, current, and has the same path/data semantics required by the CLI.
- Behaviour checks for command grammar, results, safety checks, and durable task records.
- Failure behaviour when the generated artifact is missing or invalid.

Bundling should remain an untested hypothesis until measurement shows it is necessary.

## Smallest change to test first

Change the common module to consume the generated JSON or its existing direct path, without importing the generator or compiler. Keep the CLI’s composition root and command path unchanged.

Compare cold latency and public command behaviour against the baseline.

## Removable if it succeeds

Remove the unnecessary generator/compiler startup path. The daemon-related machinery then has no demonstrated requirement and should not ship:

- HTTP server and service installation
- second composition root
- duplicate route table
- lazy route loader
- parity tests for the duplicate path
- service status and recovery commands

The direct CLI and durable completed records remain the supported contract.

## When residency becomes justified

Reconsider a resident process only when measured use requires continuity across commands—such as a persistent connection or stateful session—and that requirement cannot be represented as durable data or supplied through the ordinary CLI path. The resident design must then demonstrate that its measured benefit outweighs its installation, recovery, status, and maintenance burden.
