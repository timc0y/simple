Pass only if the review identifies the false unlimited-retry claim, cites the observed
limit of one request plus two retries, explains that the claim can make users wait for
recovery that will not happen automatically, and gives the smallest correction: state
the finite limit, exit status 23, and useful rerun guidance for that failure. Advice to
rerun after status 23 or when the service is available is sufficient; no exact phrase
is required. Mentioning the supplied fact that retry count is not configurable is
allowed but not required. It must distinguish the generic opening as a lower-priority
writing issue rather than conflating it with the correctness defect. Fail if it only
rewrites the prose, says merely that the wording is unclear, invents configuration, or
treats every comment as equally important.
