# Writing-rules screen protocol

Registered before any solver call.

Question: do the plain-vocabulary, outcome-first, one-concern, verdict-first, and
report-once rules, plus the `simple round` status shape, change what the agent writes
on the failure shapes observed in the owner's session corpus, without regressing the
stated-requirement pair from the 11 September screen?

Cells: six cases, three conditions (none, current at `ee0e9f2`, candidate at the
evaluated HEAD), two repeats. Thirty-six sequential `gpt-5.6-luna` solver calls,
default reasoning, isolated Codex harness with repository and global skill reads
denied. Condition order reverses in the second repeat. One excluded preflight call.

Cases: `plain-translation` (vocabulary, outcome first, before-and-after),
`verdict-first` (safety question), `round-status` (status shape during a round),
`scope-completion` (written scenario for report-once; it does not exercise a live
tool loop), and the `stated-requirement` pair as a regression control.

Grading: one Luna grader call per case with the frozen criteria, the pass and fail
references, and every anonymous answer. The grader must accept the pass reference and
reject the fail reference. The lead reviews every current-pass/candidate-fail pair.

Metric: strict pass per cell. Worthwhile effect: candidate gains on at least two of
the four new cases with no current-pass/candidate-fail pair anywhere, including the
regression pair. Stopping rule: stop after thirty-six cells; preserve misses; a tie is
inconclusive. The round file injection and check are proved by structural tests, not
by this run.
