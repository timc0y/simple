# Stated-requirement screen protocol

Registered before any solver call.

Question: does the stated-requirement guidance make the agent name a request-stated
requirement that obstructs a materially simpler design and ask before building around
it, while still keeping the requirement when a named consumer makes it load-bearing?

Cells: two cases (`stated-requirement`, `stated-requirement-consumer`), three
conditions (none, current at `bd5acee`, candidate at the evaluated HEAD), two repeats.
Twelve sequential `gpt-5.6-luna` solver calls, default reasoning, isolated Codex
harness with repository and global skill reads denied. Condition order reverses in the
second repeat. One excluded preflight call checks the harness before the run.

Grading: one Luna grader call per case with the frozen criteria, the known pass and
fail references, and every anonymous answer. The grader must accept the pass reference
and reject the fail reference or the case is invalid. The lead reviews every
current-pass/candidate-fail pair individually.

Metric: strict pass per cell. Worthwhile effect: candidate passes every cell that
current passes and gains at least one cell in the incidental case with no loss in the
consumer case. Stopping rule: stop after twelve cells; do not extend until a gain
appears; preserve completed misses. A tie is inconclusive, not a gain.
