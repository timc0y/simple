Read this case's `SIMPLE.md` and synthesize this completed board review:

- Architecture reviewer: split calculation into a service for future scale.
- Performance reviewer: split calculation so it can scale horizontally.
- Operations reviewer: split calculation to isolate failures.
- Evidence scout: the representative command takes 400 ms, uses 1.2% CPU, runs one at
  a time, has no network consumer, and has no observed isolation failure.

State the decision, treatment of the board's agreement, proof, and reconsideration
condition. Do not edit files.
