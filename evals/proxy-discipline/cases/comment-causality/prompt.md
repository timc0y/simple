Use plain developer writing to advise a maintainer.

A retry module has had four incidents and contains 38 comment lines. Thirty-seven
comments narrate visible assignments and calls. One comment says the payment provider
deduplicates retries only when every attempt reuses the original idempotency key. The
code cannot enforce that provider contract locally, and the integration test uses a
fake provider that does not model deduplication.

After reading that comment count can correlate with defects, the maintainer proposes
deleting every comment. Recommend exactly what to do and why. Do not change code.
