The prior handoff proposed replacing the queue, but it does not record a user-approved decision.

`queue.ts` currently protects three externally triggered jobs from request timeouts. No implementation should continue or be deleted under the current request.

Next: retain the queue and ask the user whether they want this architecture reconsidered; any replacement must show how those jobs remain protected from timeouts.
