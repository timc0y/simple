# Shared grading rubric

The runner sends only the text between the judge markers to the grader, after the
case criteria. Everything outside the markers is for the lead: gates, noise floor,
and how to read the scores. The pass verdict still comes from the case criteria; the
dimensions are graded beside it so a response that improved without passing is
visible, and a pass that got harder to read is visible too.

<!-- judge:begin -->
Score each candidate on four dimensions from 1 to 5. Quote the sentence that decides
each score. Scores do not change the pass verdict, which comes only from the case
criteria. Judge the requested operation and destination. A required literal edit,
quotation, code block, or output format overrides presentation defaults. Do not demand
an opening, ending, action, or rewrite the task does not need.

Readability for a reader with a small working memory:
- First line: where the writer chooses the opening, it answers the reader's question
  or begins the requested explanation without a generic preamble.
- Last line: the answer ends when the requested content is complete. Name remaining
  work, an action, or a question only when the task calls for it; do not add an offer.
- Vocabulary: every technical noun appears in the prompt or is explained in the same
  sentence. More than two unexplained terms fails this check.
- Structure: grouping helps the reader follow the content. Do not fragment connected
  reasoning or penalize a required list, heading, or preserved source structure.
- State: when the prompt supplies build, branch, tree, or test state, one line restates
  material state accurately where it supports the answer; no fixed position is required.
Treat an inapplicable check as satisfied. 5 = all five hold. 4 = one misses. 3 = two
miss. 2 = three miss. 1 = four or more miss.

Actionability: when the task calls for action, the reader can take it without an
avoidable follow-up. 5 = required actions name their targets and actors, or the task
needs no action. 3 = a required target or actor is missing. 1 = a required action
cannot be taken from the text. Do not reward invented actions.

Completeness: every material fact, decision, constraint, unknown, and next action from
the governing sources survives with its relationships, subject to requested corrections
or explicit replacement evidence. Check additions against the sources and omissions
against the request; names and numbers alone do not prove fidelity. 5 = nothing
material lost or distorted. 3 = one nondecisive omission or distortion. 1 = the answer
loses or changes something the reader needs. Unchanged text meets an improvement
request only when it already satisfies that request.
Accept faithful paraphrases; retaining expected terms does not excuse a wrong relationship.

Concision: no preamble, recap, filler, or tangent; brevity did not remove substance.
5 = nothing to cut. 3 = one paragraph or list could go. 1 = most of the text could go.

Blocker: set true only for an invented fact, an action the prompt forbade, a silently
dropped obligation, or a claim that something ran when the text shows it did not.
A blocker requires a failed verdict. A failure need not be a blocker.
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

These scores are grader assessments, not measured human understanding. Use the
reader-study boundary in `evals/README.md` before claiming a comprehension gain.
