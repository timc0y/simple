## Design decision

Don't introduce the service abstraction or queue now. Keep report generation and persistence in the report module as they are.

"Reports will probably grow later" is a future possibility, not an observed requirement — that's the specific case the skill flags as insufficient grounds for a new concept. A queue and a separate service are two additional owners, two additional failure modes, and an async contract, all paid for before anything demonstrates the load or isolation actually needs them.

## Existing owner and ordinary path

The report module already owns both generation and persistence, in-process. That's the ordinary path, and nothing about the current load exceeds what it handles.

## Assumptions that affect the decision

- One local operator, no external consumers — nothing depends on reports being generated out-of-process or on a stable service contract.
- No compatibility commitments outside the repository — there's no API surface to protect by decoupling now.
- Current load is handled in-process today — no measured slowdown or contention exists to fix.

If any of these change — a second consumer starts depending on reports, load is measured to exceed in-process capacity, or reports need a lifecycle independent of the app's — the decision flips: that's exactly the condition SIMPLE.md names under "Reconsider when."

## Independent proof

Generation and persistence can be verified through the report module's existing public surface (call it, confirm a report is produced and stored) without touching a service or a queue. That the current behavior is provable through the module alone is itself the evidence that no additional owner is needed yet — a queue would only be provably necessary once something (a load number, a second consumer) exists outside the report module to point at.
