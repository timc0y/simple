Ship the one-shot CLI, after removing the unnecessary startup dependency.

First establish a cold-start latency breakdown: process startup, module import/evaluation, remote operation, and output. Confirm that the generator → compiler import chain accounts for the ~180 ms and measure bundling separately before treating it as a solution.

Test the smallest change first: move the path constant into a small dependency-free module (or otherwise make the CLI import the generated JSON directly), so the command never loads the generator or compiler.

If that restores acceptable latency without changing command grammar, results, safety checks, or completed-task records, remove the daemon, HTTP server, service installation, second composition root, duplicate routing, lazy loader, parity tests, and service management/recovery commands.

A resident process becomes justified only when measurement identifies a required cross-command capability—such as continuity that cannot be represented in durable completed-task data—and the one-shot CLI cannot provide it. Startup time alone is not that capability.
