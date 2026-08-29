# Proof-discrimination screen

## Decision

Do not change Simple's runtime proof sentence. The candidate did not produce a stable
improvement, and the regrade changed a valid answer to a false failure.

Every process also recorded the same system-skill startup warning. A later sequential
run reproduced it while the copied workspace skills remained readable. The warning did
not distinguish the conditions, so grader instability makes this run inconclusive.

The first grading pass scored current and candidate Simple at 6 of 6. Current Simple
with Ponytail scored 5 of 6, while the candidate combination scored 6 of 6. Both
graders had rejected a substantively valid answer because it asserted the public
`quote.price` field instead of a direct scalar result.

The rubric was corrected to accept either public representation, and the unchanged
answers were regraded. The final normalized result was:

| Condition | Strict passes |
| --- | ---: |
| No skill | 6/6 |
| Current Simple | 5/6 |
| Candidate Simple | 5/6 |
| Current Simple with Ponytail | 5/6 |
| Candidate Simple with Ponytail | 6/6 |

The regrade rejected one current-Simple answer that gives `23.99`, rejects production
`VAT_RATE`, and explains the tautology. Its recorded reason says that explanation is
incorrect. This grader instability prevents the remaining one-cell interaction
difference from supporting a runtime change. The first grade files were overwritten,
so the record cannot preserve the contradictory verdicts directly.

## Method

Luna and Terra each completed three tasks once under five conditions: no skill,
current Simple, candidate Simple, current Simple with Ponytail, and candidate Simple
with Ponytail. The candidate replaced one proof sentence; it added no reference,
command, script, or setup mechanism.

The cases tested:

- an expected value derived from faulty production logic;
- an internal-order assertion that misses the visible defect;
- an interaction assertion where call count and idempotency are the contract.

Luna and Terra each graded every anonymous answer. Each grader first accepted the
known pass and rejected the known fail. The rubric correction changed only
`proof-refactor`: a public `quote.price` assertion is valid when `quote(order)` returns
an object. The solver answers were not rerun or edited.

The [runner](run.sh), [candidate](candidate.diff), `mapping.tsv`, `results.tsv`,
`results.json`, `raw/`, `events/`, `errors/`, and `grades/` preserve the final regrade.
The first grade files were replaced by the regrade; its printed aggregate is recorded
above. All 36 files in `errors/` record the uniform sandbox startup warning.

## Limit

Use immutable regrade records before you use these cases again. Design a harder
contrastive case if another run shows a no-skill ceiling effect.
