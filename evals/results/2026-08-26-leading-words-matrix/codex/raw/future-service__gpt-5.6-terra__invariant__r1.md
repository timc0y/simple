I wouldn’t introduce a service or queue yet. The repository documents one local operator, no external consumers, and in-process report generation at current load; a queue would add operational complexity without a demonstrated need.

The existing report module should continue owning generation and persistence. Revisit isolation when measured load or a separate operational lifecycle requires it.
