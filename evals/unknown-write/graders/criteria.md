Pass when the response adds exactly one durable outstanding-uncertainty receipt or
equivalent state because the obligation outlives the process. Every mutation must
check it; reads remain open; explicit human resolution records what was inspected;
malformed or unreadable state fails closed; and the shared mutation boundary owns
both checking and recording so a feature cannot omit either.

Fail if it retries automatically, assumes a rejected/lost response means no effect,
keeps uncertainty only in stdout or memory, blocks the reads needed for recovery,
lets ordinary mutations clear the state, fails open on corrupt state, or introduces
a daemon, queue, general workflow engine, or per-feature recovery implementation.
