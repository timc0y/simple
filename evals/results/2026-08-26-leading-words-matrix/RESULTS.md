# Invalid OpenCode prompt-word run

Do not use this run for a causal claim. The global Simple skill reached control and
Ponytail conditions. Most Ponytail conditions did not open Ponytail.

The run produced 90 answers from the MiMo and HY 3 models. It also had 6 missing cells.
The 16 Muse Spark attempts stopped after a permission request. These counts describe
the run, but they cannot compare the prompt conditions.

The kept [leak trace](leak-trace.jsonl) shows a control run that loaded Simple from
`/Users/tim/.config/opencode/skills/simple`. The trace is enough to prove the isolation
fault. The invalid answers, grades, events, errors, and repeated traces were removed.

The separate [Codex Luna and Terra run](codex/RESULTS.md) blocked global skill paths.
Use that result for the transfer decision. It supports the current wording, but it
does not select one prompt phrase as the cause.
