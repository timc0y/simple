# Google writing ideas trial

Neither candidate ships. The contrastive-example instruction did not improve the
answers. The actionable-review instruction appeared to gain one strict pass in
confirmation, but manual review found that pass difference came from a grader silently
strengthening the logging contract.

## Decisions

| Candidate | Screen | Confirmation | Decision |
| --- | --- | --- | --- |
| Actionable review findings | Candidate 2/4; current 0/4; no skill 1/4 on the final sequential grade | Candidate 8/8; current 7/8 | Inconclusive negative; the sole confirmation difference is a grader false negative |
| Contrastive near miss | Candidate 1/4; current 2/4; no skill 1/4 on the final sequential grade | Not run | Valid negative; stop because the candidate did not improve the screen |

The earlier anonymous grades are retained because regrading changed several verdicts.
The first post-contract actionable grade was candidate 2/4, current 1/4, and no skill
2/4. The first contrastive grade gave every arm 2/4. These changes reinforce that the
small score differences are not reliable skill gains.

## Manual adjudication

In the actionable confirmation, Terra rejected current-Simple answer
`7fe4fde93aa4` because it allowed redacted header logging. The supplied repository
contract said only that authentication logs must not contain credentials. The answer
required credential-free logs, safe metadata, and redaction of sensitive headers, so
it satisfies that contract. The candidate's apparent 8/8 to 7/8 advantage therefore
does not justify runtime text.

The actionable screen rubric was corrected after graders treated the supplied fact
that retry count is not configurable as an invented claim and demanded one exact
recovery phrase. The original grades and the corrected regrades are both retained.

## Method and evidence

Luna and Terra each answered two writing or review cases under no-skill, current-Simple,
and candidate-Simple conditions. The actionable confirmation used two runs of only the
current and candidate conditions. Luna and Terra graded anonymous answers after
accepting the known pass and rejecting the known fail.

Concurrent solver and grader processes exposed local Codex skill-install races. The
runner was corrected to execute them sequentially. It also rejects literal placeholder
IDs in grader output. Failed harness attempts do not contribute to the decision.

- `actionable-screen/`, `actionable-confirmation/`, and `contrastive-screen/` contain
  mappings, answers, grader records, TSV results, and normalized JSON.
- `run.sh` is the final corrected runner. The two candidate diffs are preserved beside
  it.
- Model revisions are recorded as `gpt-5.6-luna` and `gpt-5.6-terra`; token use and
  latency were not available from this runner.
