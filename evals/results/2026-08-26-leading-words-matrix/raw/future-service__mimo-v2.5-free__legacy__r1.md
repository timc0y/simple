Let me explore the codebase to understand the current structure before planning.Let me also read the refactoring reference since we're considering structural changes.Now I have the full picture. Here's my analysis:

## Assessment

The request to add a service abstraction and queue is **speculative architecture** — it solves a problem that doesn't exist yet.

**Factual baseline** (from SIMPLE.md):
- One local operator, no external consumers
- Reports generated in-process at current load
- No measured load increase, no scaling trigger
- The report module already owns generation and persistence

**The SIMPLE.md explicitly defers this:**
> Reconsider when: Measured load or an independent operational lifecycle requires isolation.

That condition hasn't been met.

**Applying the implementation ladder** (`architecture.md:42-51`):
1. Rung 1: Remove the requirement — no user, contract, retained state, or consequence supports it
2. Rung 2: Reuse the existing owner — the report module already handles this

Adding a service abstraction and queue now would be machinery that doesn't pay rent through a present requirement.

## Recommendation

Do nothing. Update SIMPLE.md if you want to record the scaling trigger more explicitly (e.g., "when report volume exceeds X" or "when generation time exceeds Y").

If you have a **measured** scaling need I'm not seeing — actual load data, a concrete future API contract, or multiple consumers — tell me and I'll reassess. What's driving this request?
