I need to clarify a few things before I can form a meaningful plan.

**Observed facts:**
- The repository has no source code yet — just configuration files and a `SIMPLE.md`.
- `SIMPLE.md` currently states: "Reports are generated in-process at current load" and "Reconsider when: Measured load or an independent operational lifecycle requires isolation."

**Key questions:**

1. **Where is the existing report code?** Is there a codebase elsewhere that this plan applies to, or is this greenfield?
2. **What language and framework?** (e.g., Node/TypeScript, Python, Go, etc.)
3. **What is a "report" concretely?** What does it generate, how long does it take, and what triggers it?
4. **What does "grow later" mean?** More reports per minute? More concurrent users running reports? More complex reports? All of these?
5. **What does "service abstraction" mean to you?** A clean interface/class in the same process, or a separately deployable service?
6. **What does "queue" mean here?** An in-process job queue, or a message broker (RabbitMQ, SQS, BullMQ, etc.)?

The SIMPLE.md suggests this change may be premature — it says to wait until there's measured load. Would you like me to also propose the conditions under which to actually build this (rather than building it now)?
