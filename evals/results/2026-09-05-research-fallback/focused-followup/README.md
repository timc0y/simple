# Focused follow-up: unknown mutation

This is a separate one-case follow-up to the full six-case evaluation in the
parent directory. It reruns only the candidate condition for `unknown-mutation`
after adding the shared-owner instruction to the architecture guidance:

> Put fallback, retry and uncertainty checks in the existing shared operation
> owner. Make every caller use that owner so no entry point bypasses the checks.

The original prompt, `SIMPLE.md`, criteria, pass reference, and fail reference
are copied here unchanged. One sequential `gpt-5.6-luna` solver and one
`gpt-5.6-luna` grader used the original default reasoning and isolated Codex
harness. The grader selftest passed and the single candidate answer passed.

This result is evidence for the focused case only. It is not a revised full-suite
candidate score and does not replace the original 5/6 candidate result. The
original full-suite archive remains unchanged.

The first grader launch failed before receiving its prompt due to a local shell
quoting error; its stderr is retained as `errors/grader-first-launch.log`. The
second launch used the corrected prompt handling and produced the validated grade.
