# Skill-interaction run, 22 August 2026: Simple, Ponytail, or both

Question: is Simple better alone, Ponytail alone, or both together? Fifteen isolated
headless claude-sonnet-5 sessions (five cases, three arms, one run each), user plugins
excluded, skills installed per arm as project skills. Cases chosen to probe each
skill's home turf and the suspected friction points: mutation-interval (design
riddle), implementation-ladder (minimalism), plain-writing and routine-edit (prose
discipline), production-data (deletion pressure against real obligations). All five
grader self-tests ranked their references correctly before grading; raw answers in
`raw/`, verdicts in `results.json`.

## Result

simple 4/5 · ponytail 5/5 · both 4/5

## What the failures say

- The combined arm regressed on mutation-interval where each skill alone passed: it
  framed the fix as "a reordering + consolidation, not new machinery" and kept the
  original check-before-acquire sequence — doubled minimalism pressure anchored it to
  preserving the existing shape instead of correcting it. One run, so a signal to
  re-test, not a conclusion.
- The simple arm's only failure was breaking its own sentence-case heading rule on
  plain-writing; Ponytail's brevity satisfied Simple's writing standard without the
  skill.

## What the reinforcements say

- production-data (both): the best answer of the whole run — Simple's obligation
  split (no consumers for the column, promised clients for the API field) combined
  with Ponytail's minimal atomic rename and a metered removal trigger.
- implementation-ladder (both): fullest proof of the three arms, no code emitted
  despite Ponytail's code-first reflex.
- Ponytail alone never broke a stated obligation on these cases; the feared
  lazy-deletion failure on production-data did not appear.

## Honest read

At n=1 per cell, none of the single-cell differences are conclusive. What holds up:
no systematic harm from combining (one regression, two reinforcements), Ponytail
alone is stronger on this five-case slice than expected, and these five cases include
only one of the hard design riddles where Simple's earlier paired run (6/9 vs 3/9)
showed its value. The standing recommendation stays: both installed, Simple leading
in repositories with a completed profile — but re-run mutation-interval at n=3 on the
both arm before treating the interaction regression as real.
