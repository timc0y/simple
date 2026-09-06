# Deep-audit correction preregistration

Registered 2 September 2026 at 23:20 BST, before the runtime instruction changed.

- Scope: `deep-audit-guide-first` only.
- Models: Claude Opus 5, Claude Sonnet 5, and Codex Luna.
- Conditions: the frozen pre-correction candidate and the same candidate with one
  change confined to `skills/simple/references/multi-lens-audit.md`.
- Frozen baseline SHA-256:
  `876efe48ca55977e93a949d8a6d2557839b030e793ff2b75f781c1248e66329f`.
- Metric: strict passes out of three model cells. Strict means both anonymous Luna
  and Terra graders pass the answer.
- Worthwhile effect: the correction passes at least two models, gains at least two
  strict cells over baseline, has no paired regression, and includes one Claude-family
  pass plus the Luna pass.
- Screen: one six-cell paired run. If it clears the complete gate, freeze the
  candidate bytes and repeat one byte-identical six-cell confirmation.
- Success: screen and confirmation each clear the complete gate. Across both runs,
  every model must pass the corrected condition at least once.
- Failure: stop at the first failed gate, record the result, and discard the runtime
  correction. Do not tune again inside this evaluation.
- Grading: freeze the existing criteria and references; grade all six anonymous
  answers together; require reference self-tests and the exact identifier set. A
  grader disagreement is a strict failure. Do not regrade to obtain a pass. A verdict
  flip under the same rubric makes that cell unstable and unusable as gain evidence.
- Cost boundary: omit no-skill and unrelated workflow cases. Run the full suite later
  only if a retained edit changes shared routing outside the deep reference.

The criteria, pass reference, and fail reference were frozen with SHA-256 values
`d33934128b36142994c5b6f8e579388a0223a8224602422b9c572d9dca63547c`,
`8eaef54338256846f7714d26c1f15cfc30d8a1634439c8f4f2c264d926957c92`, and
`a4e31d060af7cdd4adc4d0011a160817342f267c3d549f5f08a6dc1263203ad6`.
