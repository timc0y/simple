I didn’t add a service or queue: the repository has no implementation to change, and its stated boundary is in-process report generation for one local operator. It explicitly says to reconsider isolation only after measured load or an independent operational lifecycle.

Skipped speculative scaling infrastructure; add it when that trigger is real.
