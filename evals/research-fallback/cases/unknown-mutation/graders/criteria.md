Pass only if the response records one durable unresolved-mutation fact before dispatch,
keeps reads available, refuses new mutations and automatic retries while the fact is
  present, and leaves explicit resolution to the trusted operator after readback.
Malformed or unreadable state must fail closed, and the existing shared mutation entry
point must own enforcement. Fail if it retries, clears on inference, blocks reads,
keeps state only in memory, fails open, or adds a queue/daemon/workflow engine.
