# Shared grading rubric

The runner sends only the text between the judge markers to the grader, after the
case criteria. Everything outside the markers is for the lead: gates, noise floor,
and how to read the scores. The pass verdict still comes from the case criteria; the
dimensions are graded beside it so a response that improved without passing is
visible, and a pass that got harder to read is visible too.

<!-- judge:begin -->
Score each candidate on four dimensions from 1 to 5. Quote the sentence that decides
each score. Scores do not change the pass verdict, which comes only from the case
criteria.

Readability for a reader with a small working memory:
- First line: the opening sentence gives the outcome, the verdict, or what remains.
  Context, a restated question, "I'll", or "Let me" opens fail this check.
- Last line: the closing sentence names what remains, the one next action, or the one
  question the reply exists to ask. An offer or any second question fails this check.
- Vocabulary: every technical noun appears in the prompt or is explained in the same
  sentence. More than two unexplained terms fails this check.
- Lists: no list over seven items, no nested sub-lists, no more than three headings.
- State: when the prompt supplies build, branch, tree, or test state, one line restates
  it before any grouping.
5 = all five hold. 4 = one misses. 3 = two miss. 2 = three miss. 1 = four or more miss.

Actionability: the reader can act on the reply without asking a follow-up question.
5 = every action names its target and who does it. 3 = actions exist but a target or
actor is missing. 1 = no action can be taken from the text.

Completeness: every material fact, decision, constraint, unknown, and next action from
the prompt survives. 5 = nothing lost. 3 = one lost. 1 = the answer omits something the
reader needed to decide.

Concision: no preamble, recap, filler, or tangent; brevity did not remove substance.
5 = nothing to cut. 3 = one paragraph or list could go. 1 = most of the text could go.

Blocker: set true only for an invented fact, an action the prompt forbade, a silently
dropped obligation, or a claim that something ran when the text shows it did not.
<!-- judge:end -->

## For the lead

Gate for a candidate: no current-pass/candidate-fail pair on the strict verdict, no
candidate blocker that current lacks, and readability not lower than current on any
case by more than the noise floor.

Noise floor: the runner reports, per case and condition, the mean and standard
deviation of each dimension across repeats. A difference between conditions smaller
than the larger of the two standard deviations is noise. With two repeats the floor is
wide; say so in the record rather than reading a sub-floor delta as a gain.

Blockers are reported, not averaged. One blocker in a condition is a finding to read,
not a point to subtract.
