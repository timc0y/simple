# Readable-rules screen protocol

Registered before any solver call.

Question: do the debug-spiral trigger in the core stop list and the list-cap,
failure-shape, and inspection-is-not-execution rules in the writing reference change
what the agent writes on the four shapes they target, without regressing the
stated-requirement pair or the round-status shape?

Cells: seven cases, three conditions (none, current at `c28f3b7`, candidate at the
evaluated HEAD), two repeats. Forty-two sequential `gpt-5.6-luna` solver calls, default
reasoning, isolated Codex harness, condition order reversed in the second repeat, one
excluded preflight. Grader: one Luna call per case with the frozen criteria, the
shared rubric between its judge markers, the pass and fail references, and every
anonymous answer; self-test on the references. Dimensions scored 1 to 5 beside the
verdict; noise floor reported per case and condition.

Cases: `debug-spiral`, `list-cap`, `failure-shape`, `inspection-not-execution` (new,
synthetic, written scenarios), `round-status`, `stated-requirement`, and
`stated-requirement-consumer` (regression).

Gate for adoption: no current-pass/candidate-fail pair on the verdict, no candidate
blocker that current lacks, and candidate readability not below current beyond the
noise floor on any case. A tie is inconclusive. Stop after forty-two cells.
