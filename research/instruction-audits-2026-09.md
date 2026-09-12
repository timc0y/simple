# Instruction audits, September 2026

Two reviews of Simple's instruction files, run on 11 and 12 September 2026. Both are
adoption decisions about existing text, not runtime instructions.

## Model-run audit of the skill and an operator file

Method: the current skill, its references, command files, hook manifest, and one
person's operator file were handed to GPT-6 Astra in an isolated workspace with one
question: which rules were written to constrain or prod an older model and would you
drop, relax, or merge for a current model. The prompt and the full report are private
local context; this section records what was adopted. The audit reasons about a rule's
function, not its author's intent, and says so.

Adopted into 0.8:

- Command files reduced to entry points that route to the command reference, since
  their procedural text duplicated it.
- Model-tier names removed from the model-profiles reference in favour of capability,
  consequence, and cost.
- The literal proof labels in the repository-work handoff rule replaced by the
  substantive distinction between local and live proof.
- The init command aligned with the profile template: owner-only facts are recorded
  as explicit unknowns rather than leaving setup incomplete.
- Guard authorisation by an affirmative reply to a proposal rather than by a word
  alone, with negation counted only next to the action.

Held: shortening the examples reference or the architecture lead. The 27 August
architecture-reference run showed the shorter version passing 10 of 12 against 12 of
12, so removal there needs its own run. Held: relaxing the deep-audit output shape and
the operator-emulation passes, pending a case that exercises them.

Rejected: lexical-only guard authorisation, which the audit showed lets a negated
sentence unlock an action.

## Crawl of i-have-adhd

Source: [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) at commit
6f1f982, 10 September 2026, read in full by three readers: rules, mechanism, evals.

Adopted:

- Into the operator file, no eval: status as position, first-and-last-line send check,
  the debug-spiral rule, task-wins precedence, nothing kept off screen.
- Into the writing reference, with a run that tied: list cap with its completeness
  carve-out, failure shape, and inspection-is-not-execution. The debug-spiral trigger
  was tried in the core stop list, showed no effect and a readability cost in the
  readable-rules run, and stays in the operator file only.
- Into the mechanism: a CI job that installs the plugin from the checkout, hook
  fail-open with one stderr line, an OpenCode plugin that appends context to the
  system prompt every turn, and a Gemini extension with a context file.
- Into the evals: dimension scores beside the verdict, a shared rubric with judge
  markers, a per-case noise floor, and a readability dimension.

Rejected, with reason:

- Time estimates in minutes: the agent executes, and the number would be invented.
- Command-first ordering: a command is mechanism; the operator file leads with what
  the reader sees.
- A single global on/off flag and silent catch-all error handling in hooks.
- The absolute blocker gate in their eval, which their own results file says no
  candidate can pass.
- Their reported gain: 82 percent of the delta came from two of fourteen cases and six
  of ten claimed wins sat inside their own stated noise floor.
