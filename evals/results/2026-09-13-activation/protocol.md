# Activation screen protocol

Registered before any solver call, 13 September 2026.

Question: with the current skill available but never named, does the agent open it on
tasks the description targets, and leave it closed on tasks it does not?

Cells: twelve prompts, six should-fire (architecture choice, fallback deletion,
compatibility rename, migration plan, release handoff, read-only audit) and six
should-not-fire (a typo, a regex explanation, a local rename, a date format, an HTTP
status question, a shell one-liner), two repeats, one condition, `gpt-5.6-luna`,
default reasoning, isolated Codex harness. Twenty-four sequential calls. Activation is
the skill file being opened in the event trace; no grader.

Metric: should-fire hit rate and should-not-fire false-fire rate, reported separately.
No threshold is registered; this is the first negative-trigger baseline for Simple
and exists to be compared against a later description change. Prompts are frozen in
the record. The 27 August activation run is the only prior evidence, with one
trivial control.
