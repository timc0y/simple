Ship the one-shot CLI, not the resident daemon.

First establish a cold-start latency breakdown across repeated fresh processes: time spent importing the common module, generator, compiler, reading/parsing the generated JSON, remote operation, and process exit. Confirm command results and safety checks are unchanged. Measure bundling separately; it is not evidence until it improves this command’s cold latency without changing behaviour.

Test the direct dependency change first: make the common module read or import the generated JSON/path constant without importing the generator or compiler. The command needs the generated output, so generation should remain in its existing build/generation path, not in command startup.

If this removes the regression, keep the ordinary single-process command path and remove the daemon, HTTP server, service installation, second composition root, duplicate route table, lazy route loader, parity tests, and service status/recovery commands.

A resident process becomes justified only when measurement identifies a required capability that needs continuity across commands and cannot be represented as durable completed-task data. Hiding an uninvestigated ~180 ms startup cost is not that condition.
