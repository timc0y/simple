Delete the 37 comments that only narrate visible code. Keep the idempotency-key comment.

That comment records a non-local payment-provider contract and a test gap; deleting it would remove the only warning preventing a plausible, costly retry regression. Comment count may be a defect signal, but it is not evidence that every comment causes defects.
