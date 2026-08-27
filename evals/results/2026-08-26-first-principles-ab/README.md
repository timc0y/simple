# First-principles text comparison, 26 August 2026

## Purpose

This test asks whether first-principles language and an invariant step improve Simple.
It also checks ordinary-path reuse, root-cause work, and real compatibility.

The current arm used commit `1d956ce`. The candidate arm used `candidate.diff`.
The candidate made these changes:

- Put `first-principles reasoning` at the start of the skill description and first paragraph.
- Separate facts and commitments from inference, assumptions, and unknowns.
- State the required outcome or invariant before you examine the implementation.
- Reuse the current owner and path when they satisfy the invariant.
- Try to falsify the result through independent proof.
- Use precedents and analogies as hypotheses that repository evidence must support.

## Test method

Claude Code 2.1.238 ran isolated `claude -p` sessions with claude-sonnet-5.
The model used its default reasoning setting.
Each workspace supplied only the applicable project skill and the case fixture.
The command option `--setting-sources project,local` excluded user plugins.
The combined arms also supplied Ponytail 4.9.0 as a project skill.

Claude Fable 5 graded each answer against the current criteria.
It first graded the pass and fail references to check each grader.

The installed Claude command-line interface did not run `claude plugin eval`.
It identified that command as an early access feature.
The test used `run-solvers.sh`, `run-combined-solvers.sh`, `run-graders.sh`, and `run-combined-grader.sh`.
These files contain the exact test method.

The grader scored 22 usable answers.
One candidate `mutation-interval` run returned only a permission request.
The `raw` directory contains this result. A replacement run supplied `r4`.

## Results

| Case | Current | Candidate | Current with Ponytail | Candidate with Ponytail |
| --- | --- | --- | --- | --- |
| mutation-interval | 1 of 3 | 3 of 3 | 1 of 3 | 1 of 3 |
| ordinary-path | 1 of 1 | 1 of 1 | not run | not run |
| startup-root-cause | 1 of 1 | 1 of 1 | not run | not run |
| production-data | 1 of 1 | 1 of 1 | 1 of 1 | 1 of 1 |
| first-principles activation behaviour | 1 of 1 | 1 of 1 | not run | not run |

The candidate passed all 3 `mutation-interval` runs. The current arm passed 1 run.
The candidate answers defined the safety invariant before they reused the current sequence.
They moved receipt checks and records inside the lock owner.
They kept the lock when a record operation failed.
They also specified proof with real concurrent processes.

Each control passed in both arms.
The answers reused the runner and corrected the measured import path before they considered a daemon.
They also kept the production data and the promised compatibility period.

The combined candidate passed 1 of 3 `mutation-interval` runs.
The combined current arm also passed 1 of 3 runs.
The candidate did not correct the known Simple and Ponytail interaction fault.
The combined production-data control passed in both arms.

Two debug runs used the activation prompt. The Simple skill ran in both arms.
The file `activation/trace.md` contains the applicable debug lines.
This test does not show an invocation gain.
The current description already activated Simple for this software-design prompt.
Use more implicit prompts before you claim an invocation gain.

## Decision

Keep the candidate. It changed the Simple-only hard case from 1 of 3 to 3 of 3.
It did not cause a control failure or make the combined result worse.
Keep the first-principles phrase as the candidate's compact leading word.
Do not claim better invocation from this test.
Keep the current advice to use only 1 minimalism skill for interval designs.
