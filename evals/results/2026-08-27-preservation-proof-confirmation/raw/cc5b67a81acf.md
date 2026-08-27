Ship the direct CLI, not the daemon.

First establish a cold-start profile for representative commands: total wall time, module-load time, generator/compiler time, generated-JSON read time, and remote-operation time. Also measure a bundled CLI before treating bundling as a solution.

Test one small change first: let the command read the generated JSON directly, and move the output-path constant into a dependency-free module if it is still needed by the generator. The command must no longer import the generator or compiler merely to locate data it already consumes.

Verify cold-process latency improves, the JSON is the same artifact the command previously used, and normal success and failure behaviour remains unchanged.

If that succeeds, remove the resident daemon and its HTTP server, service installation, second composition root, duplicate route table, lazy route loader, daemon parity tests, and service status/recovery commands. Keep one CLI path and one route table.

A resident process becomes justified only if measurement after this decoupling—and, if warranted, measured bundling—still shows startup time materially prevents a stated latency or throughput requirement for recurring real use. At that point, the persistent process must have a demonstrated operator need that outweighs its lifecycle, recovery, and parity burden.
