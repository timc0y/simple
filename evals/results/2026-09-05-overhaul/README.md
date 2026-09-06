# Simple overhaul screen — 2026-09-05

Status: complete execution; inconclusive strict-rubric tie. The screen ran 18 sequential Luna solver sessions
(none, current `git HEAD`, candidate) over six frozen synthetic cases, followed by six
blinded Luna graders. Every grader self-test passed and every expected anonymous ID was
present exactly once.

All conditions scored 3/6: none 3/6, current 3/6, candidate 3/6. The cases passed were
`correction-preserves`, `informal-term-api-alias`, and `audience-no-invented-promise`;
the other three were strictly rejected in every condition. This is a tie and a negative/no-gain result,
not evidence that the candidate improves behaviour.

Interpret the strict failures carefully. The destination grader rejected at least one
answer that got the eligibility-before-ranking rule and proof right because it did not
recite ownership and an “existing no-route outcome” that the prompt did not establish.
Some review answers likewise omitted an ownership recital. The domain case's same-clock
proof requirement was explicit and remains a valid failure. These rubric limits make the
screen inconclusive about finer quality differences; they do not change the observed tie.

Two earlier startup attempts are excluded: one used incomplete skill snapshots and one
temporarily omitted the sandbox wrapper during diagnosis. The final run used full
current/candidate snapshots, denied implicit skill reads, and preserved raw events/errors
under `.local/overhaul-eval-2026-09-05`. Codex emitted state-database fallback warnings;
they did not alter condition access, inputs, or outputs.

The exact frozen prompts are in `cases/`; all 18 exact answers are in `raw/`; the
anonymous mapping, grader JSON, TSV, normalized results, and candidate diff are included
for inspection. Machine events, errors, and snapshots remain private. The public runner
is included as a protocol artifact and contains no user-specific home path.

This is a forced-read execution screen of synthetic text scenarios. It does not test
automatic activation, actual resumed conversations, or live integrations. No A/A noise
floor was measured, and no behavioural improvement is claimed. The candidate is retained
at the owner's request without a demonstrated gain.
