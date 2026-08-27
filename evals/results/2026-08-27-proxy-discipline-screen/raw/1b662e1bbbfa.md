Do not delete every comment.

Delete the 37 comments that merely narrate visible assignments and calls. They add no knowledge the code does not already provide.

Keep the comment about reusing the original idempotency key, and make it concise and explicit:

> Every retry must reuse the original idempotency key; the provider deduplicates requests only under that condition.

This comment records an external contract the code cannot enforce locally. It remains necessary because the fake provider and current integration test do not prove it. The four incidents strengthen the case for preserving that warning; they do not show that comments caused the defects. The missing protection is contract-aware testing or enforcement, which is a separate change.
