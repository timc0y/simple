# Preservation evaluation

The verifier self-tests run from a clean checkout without private model-run records.
Preregistration needs the previous skill snapshot at
`.local/behavior-eval-2026-09-05/frozen/candidate-skill`. The published
[frozen input archive](../results/2026-09-06-preservation/frozen-inputs.zip) contains
that skill as `previous-skill`, together with the original runner. Use the
archived runner for the recorded run; later maintenance does not change frozen inputs.

`run.py` adapts the frozen `evals/behavior/run.py` protocol for six cases, three conditions, and two sequential repeats (36 cells). Conditions are the previous full skill, the candidate skill frozen at `FINAL_FREEZE`, and the short control instruction in the same forced-read location. Condition order is counterbalanced by case and repeat.

Run `python3 evals/preservation/run.py selftest` and `preflight` while preparing cases. After the root confirms `FINAL FREEZE`, run `FINAL_FREEZE=1 python3 evals/preservation/run.py preregister`, inspect the manifest, then `READY=1 python3 evals/preservation/run.py measure`.

All model traces and failed attempts remain private under `.local/preservation-eval-2026-09-06`; the runner is imported unchanged from `evals/behavior/run.py`. The public per-cell TSV links artifact checks and a failure-review field. A no-regression decision requires every required preservation obligation to remain passing for each repeat; two repeats establish a comparison record, not a superiority claim. `writing-context` also requires manual review of prose quality, and the `writing.md` retrieval trace is recorded separately; prompted retrieval does not establish natural activation.
