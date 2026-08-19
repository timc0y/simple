## The machine built around 180 milliseconds

A one-shot command-line tool has become about 180 ms slower. It has one operator and
starts a fresh process for each command. Most commands do one short remote operation
and exit.

A resident daemon has been prototyped to hide startup time. It brings an HTTP server,
service installation, a second composition root, a duplicate route table, parity
tests, service status and recovery commands. A lazy route loader was then added to
keep the daemon and direct CLI consistent.

The slowdown has not been attributed to a required operation. One common module
imports a generator to obtain a path constant. That generator imports a compiler.
The command itself needs the generated JSON, not the generator or compiler. Bundling
has been suggested but not measured.

Decide what should ship. State the evidence you would establish, the smallest change
you would test first, what becomes removable if it succeeds, and the condition under
which a resident process would become justified.
