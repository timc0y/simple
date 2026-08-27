Ship the one-shot CLI. The daemon adds a second composition root, route table, service lifecycle, recovery path, and parity burden without a demonstrated requirement.

Establish:

- A cold-start profile separating process startup, module loading, remote work, and shutdown.
- The import graph proving that the generator pulls in the compiler.
- Whether the generated JSON already exists at runtime and how it is refreshed.
- Before-and-after command results, safety checks, and durable task-record readability.

Test first: change the common module to consume the generated JSON directly, with the smallest local path constant needed. Do not bundle until measurement shows that imports remain the material cost.

If cold latency improves and behavior remains unchanged, remove the generator and compiler from this command’s dependency path, then remove any now-unused lazy loader, daemon parity machinery, duplicate route table, service installation/status/recovery commands, and tests that only protect those paths. Recheck the dependency graph, build, and public command behavior.

A resident process becomes justified only if measured users need continuity across commands—such as a required in-memory session, connection, or coordination state—that cannot be represented as durable data, or if a measured latency requirement still fails after the direct dependency fix and repeated commands provide enough benefit to offset daemon operations and recovery complexity.
