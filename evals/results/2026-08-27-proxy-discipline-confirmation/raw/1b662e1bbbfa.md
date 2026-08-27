Do not delete every comment.

Delete the 37 comments that merely narrate assignments and calls. They add no knowledge the code does not already show.

Keep the comment about idempotency-key reuse. It records an external provider contract the code cannot enforce locally. Place it beside the retry logic or key handling, and make it precise:

> Every retry must reuse the original idempotency key; the provider deduplicates attempts only under that condition.

The fake-provider test does not prove this invariant, so the comment remains necessary until an integration test or provider contract check proves it independently. Comment count is not a deletion rule; remove redundant comments while preserving load-bearing constraints.
