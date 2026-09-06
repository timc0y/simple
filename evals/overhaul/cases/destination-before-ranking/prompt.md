Read this case's `SIMPLE.md`. Design the smallest selection rule for the requested
notification. Explain the order of filtering and ranking and give one proof case.

The system has destinations with `region`, `status`, and `latency_ms`. A notification
must go to an eligible destination in the user's region. The proposal ranks every
destination by latency first, then checks eligibility.
