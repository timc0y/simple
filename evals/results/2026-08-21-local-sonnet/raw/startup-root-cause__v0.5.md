## Decision

Ship the import fix, not the daemon. The 180 ms regression has not been traced to any required operation — it appears to be self-inflicted by a common module pulling in a generator (and the generator's compiler) just to read one path constant. The daemon prototype was built to hide that cost rather than remove it, and in doing so added a second composition root, a duplicate route table, a live HTTP service, install/status/recovery commands, and a lazy route loader whose only job is reconciling the two paths it created. None of that is required by any present obligation: this is a one-operator, one-shot CLI whose ordinary path is one process composing and executing one command, its only durable-data obligation (completed task records) is already met by data on disk, and its compatibility commitment is the command grammar and results — not the process's internal architecture.

## Evidence to establish first

- An import-time trace of a representative command's cold start (e.g. `node --prof` / `--cpu-prof`, `python -X importtime`, or the language's equivalent) to confirm the generator → compiler import chain is on the critical path and accounts for roughly the 180 ms regression, rather than something else (remote call setup, TLS, disk I/O).
- What the common module actually needs: confirm it only reads a path constant that already exists in generated JSON, and does not need the generator or compiler at runtime for ordinary commands.
- A cold-start baseline for a few representative commands, measured the same way before and after any change, so "faster" is provable rather than assumed.

## Smallest change to test first

Stop the common module from importing the generator to get a path constant. Read the value from the already-generated JSON artifact directly, and defer the generator/compiler import to only the command(s) that actually regenerate it (e.g. a build or regen subcommand), not the shared load path every command goes through. This supplies the missing precondition (a constant without its generator's transitive cost) through the ordinary one-process path — it doesn't add a route, a service, or a second owner.

Test it by re-running the same cold-start measurement on the plain CLI, with the daemon untouched and uninvoked, and confirming command results are unchanged.

## What becomes removable if it succeeds

If the import fix closes the 180 ms gap, the entire daemon apparatus loses its reason to exist and should come out: the HTTP server, service install/uninstall, the second composition root, the duplicate route table, the parity tests written to keep that duplicate table honest, the service status/recovery commands, and the lazy route loader added solely to reconcile daemon and CLI. These were all displaced complexity from solving a latency problem by hiding it; once latency is at parity there is nothing left for them to own. Removing them also removes a standing operational and security liability (a locally listening service, a second place behavior can drift) that the CLI's actual scale — one short remote operation per command — never required.

Bundling was proposed but never measured; don't reach for it. If the import fix alone doesn't fully close the gap, profile again before adding a bundler, since a narrower fix (e.g. deferring one more unnecessary transitive import) may be sufficient.

## Condition under which a resident process would become justified

Only when a specific capability is measured to require continuity across separate command invocations that cannot be represented as durable data — for example, genuine in-memory state or an open connection that can't be cheaply persisted and reloaded. Completed task records staying readable after a command exits is already satisfied by durable data on disk, not by a live process, so that obligation does not justify residency. Absent a measured capability like that, add residency only when it appears — not in anticipation of it.
