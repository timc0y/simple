The prior session proposed replacing the queue with direct synchronous calls and deleting `queue.ts`, but it did not record user approval. Current evidence shows `queue.ts` protects three externally triggered jobs from request timeouts.

No implementation or deletion should happen now. First, confirm the user’s authority and validate that synchronous calls preserve timeout protection for all three jobs.
