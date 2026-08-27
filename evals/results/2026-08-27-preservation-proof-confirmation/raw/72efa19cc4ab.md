Ship the direct CLI. Do not ship the daemon or bundling yet.

### Evidence to establish

- Measure cold-start time before and after the change, separating import time from the remote operation.
- Trace imports to confirm the common module pulls in the generator and compiler only to obtain a path.
- Verify the generated JSON already exists, is the required source of truth, and remains readable after the process exits.
- Run existing command and safety checks against a before/after baseline.
- Measure bundling only if the direct import does not remove the regression.

### Smallest change

Replace the generator import with a direct reference to the generated JSON—using the existing path or standard-library path handling. Keep generation as a build-time concern if it is still needed; remove it from the command’s runtime dependency path.

### What becomes removable

If cold latency and command behaviour return to baseline, remove the daemon prototype and its support machinery:

- HTTP server and service installation
- second composition root
- duplicate route table
- lazy route loader
- daemon parity tests
- service status and recovery commands

The generator and compiler are removable from the runtime bundle only if no other build or command path requires them.

### When residency is justified

Add a resident process only when measurements show that repeated commands need continuity that durable task records cannot provide—for example, persistent connections or in-memory state—and the one-shot CLI cannot meet the required latency or capability. Startup overhead alone justifies residency only after the smallest import fix and any measured packaging fix fail.
