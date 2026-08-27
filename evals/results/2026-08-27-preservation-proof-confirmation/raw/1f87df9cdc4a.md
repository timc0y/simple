Ship the one-shot CLI, after removing the unnecessary generator/compiler import from its startup path.

Establish:

- Cold-command timing before and after the import change, separating process startup/import time from remote-operation time.
- That every command still returns the same results and retains the existing safety checks.
- That completed task records remain readable after exit.
- Whether bundling improves the measured cold path only if the direct dependency change does not recover the regression.

Test first: replace the common module’s generator-derived path constant with the path to the generated JSON itself. The command consumes that JSON; it does not need to load the generator or its compiler.

If this restores acceptable latency, remove the daemon, HTTP server, service installation, second composition root, duplicate route table, lazy route loader, parity tests, and service status/recovery commands. They solve no current requirement and add an operational surface for one trusted local operator.

A resident process is justified only when a measured capability requires continuity across commands and cannot be represented as durable data. Startup latency alone is not that condition.
