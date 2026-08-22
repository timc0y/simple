# Precedence-edit A/B, 22 August 2026: a recorded negative result

Question: does a precedence sentence in SKILL.md fix the measured interaction
regression where Simple plus Ponytail together anchor to an existing broken sequence
(the `mutation-interval` check-before-acquire failure from
`../2026-08-22-skill-interaction/`)?

Harness: eight isolated headless claude-sonnet-5 sessions, both skills installed as
project skills in every workspace, user plugins excluded. The only variable was the
Simple snapshot: `current` (main `856385a`) versus `edited` (candidate text in
`candidate-edit.md`). `mutation-interval` ran three reps per variant;
`production-data` ran once per variant as the reinforcement control. Grader passed
both cases' self-test references before grading; raw answers in `raw/`.

## Result

| Case | current | edited |
| --- | --- | --- |
| mutation-interval (both skills) | 1/3 | 0/3 |
| production-data (both skills) | 1/1 | 1/1 |

The edit did not move the number. It does not ship. This mirrors Ponytail's own
robustness-audit finding: counter-instructions rarely override a trained reflex, and
text that does not move a number is cargo cult.

## What the run hardened

Pooling today's runs, the both-skills arm passes `mutation-interval` 2 of 9 times,
against 2 of 3 for Simple alone and 1 of 1 for Ponytail alone. The interaction
regression on interval-ordering design is real, is not fixable by the tested wording,
and is now documented in the README's usage guidance: for lock, interval, or
uncertainty-protocol design, run one minimalism skill, not two. The `production-data`
reinforcement (both skills together produced the best answers) continues to hold.
