Delete the 37 comments that narrate visible assignments and calls. Keep the idempotency comment, beside the retry/provider boundary, and make it explicit:

> Every retry must reuse the original idempotency key. The payment provider deduplicates attempts only under this condition; the local fake does not verify it.

Comment count is an indirect signal, not a deletion rule. The retained comment records an external contract that the code cannot enforce and the test does not prove. Removing it would discard the only local warning against a payment-duplication bug. 

