Read this case's `SIMPLE.md` and review the proposed change. State whether it is a bug
fix or an audit/review, what evidence is missing, and the smallest next action. Do not
invent an implementation before deciding what kind of work this is.

The team asks: “Audit our webhook retry design for hidden obligations.” No failing
request, incident, or known defect is supplied. A draft immediately changes the retry
loop to exponential backoff and claims the bug is fixed.
