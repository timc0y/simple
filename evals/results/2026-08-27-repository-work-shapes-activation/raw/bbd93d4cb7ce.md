Ship the one-shot CLI. Do not ship the resident daemon.

Evidence to establish:

- Cold-start benchmarks before and after the import change, separating process startup, module loading, remote work, and exit.
- The runtime import graph, confirming that the compiler is reached only through the generator.
- Behavioural parity: command grammar, safety checks, results, and durable task records.
- Repeated runs with both cached and uncached generated artifacts.

Test first: make the common module consume the generated JSON directly—or import only a tiny path-constant module—without loading the generator or compiler. Measure that change before attempting bundling.

If it removes the regression, the runtime compiler dependency and generator import become removable. The daemon’s supporting machinery can then be removed as well: HTTP server, service installation, second composition root, duplicate routes, lazy loader, parity tests for the second path, status, and recovery commands. Keep any generator needed purely at build time.

A resident process becomes justified only when measured usage requires continuity across commands—such as a persistent session, connection, cache, or coordination state—that cannot be represented safely as durable data, and the measured benefit exceeds the operational cost of the daemon.
