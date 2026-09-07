# Workflow execution screen

This screen checks shared-operation recovery and preservation of facts in a written handoff.
It compares no skill, the full skill before workflow expansion, and the final candidate.
Each condition runs once per case: six cells, counterbalanced by case, using the same isolated Luna harness.
This is a small forced-read execution screen, not an activation test or a superiority comparison with upstream projects.

The independently authored `shared-failure` verifier checks both entry points, distinct keys and unknown outcomes.
Its self-test rejects the original fixture and a caller-only fix, and accepts a valid shared-operation fix.
The `writing-context` case reuses the existing preservation fixture unchanged.
Its executable checks need a separate manual review of source fidelity and unsupported claims.

Stop after the six registered cells. Review every prior-pass/candidate-fail pair independently of the total.
Keep failures and raw outputs. An all-pass result is a ceiling on these tasks, not proof of broad improvement.
Inspect which references the solver actually read; stored guidance alone does not establish retrieval.

From the repository root, freeze into a new ignored record directory:

```sh
python3 evals/workflow/run.py freeze --record .local/workflow-screen --previous /path/to/previous-skill
READY=1 python3 evals/workflow/run.py measure --record .local/workflow-screen
```

The runner reuses `evals/behavior/run.py`, including isolation, preflight, artifact checks and result normalization.
It freezes both complete skill trees, both cases and the runner sources before model calls.
The imported runner requires macOS and the configured Codex CLI.
Public results follow `evals/README.md`; private host traces remain ignored.

The first recorded run exposed an overconstrained verifier: it required a thrown
timeout and zero effects for unknown mode, neither of which the task promised.
The canonical verifier now accepts honest uncertainty while checking the real
before-and-after effects across both callers. The run record preserves its original
verifier and grades separately from the corrected regrade of the same artifacts.

The later [personal-workflow screen](../results/2026-09-07-personal-fit/README.md)
found another verifier overconstraint: extra outcome metadata was rejected by exact
state-object comparison. The canonical verifier now checks required count and keys
while allowing metadata. Its self-test still rejects duplicate effects. Both the
original grades and the corrected recheck remain in that run record.
