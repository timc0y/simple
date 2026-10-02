# Native hook timing and final replies

The replacement hook preserved the requested answer in both edited Luna runs. The
installed Stop hook replaced it with cleanup status in both runs, despite correct
code and documentation. Both read-only controls passed.

| Task and repeat | Installed Stop lifecycle | Replacement before-final reminder |
| --- | --- | --- |
| Barcode fix, repeat 1 | Fail: cleanup-only final reply | Pass: concrete correction and passing checks |
| Barcode fix, repeat 2 | Fail: cleanup-only final reply | Pass: concrete correction and passing checks |
| Read-only production decision | Pass | Pass |

Final-answer totals: baseline 1/3, replacement 3/3. All six native-path checks and
artifact checks passed. Each edited fixture passed the same independent 26
assertions. Both conditions kept the README accurate. The result concerns delivery
of the requested answer, rather than a difference in code correctness.

## Decision and limits

Keep the source fix that removes Stop registration and sends reconciliation context
after the edit, before the final reply. The native traces now support this decision
on the tested CLI path. The same new Simple skill was supplied in both conditions;
this is evidence for the hook change, not a gain from the new writing sentence.
Timing, removal of Stop and reminder text changed together, so this screen does not
isolate their individual effects.

This is a small known-case screen: two repeats of one code task and one read-only
control per condition. It does not establish broad model performance, human
comprehension, or T3 rendering. The installed plugin and actual user configuration
were unchanged, verified against recorded hashes after all six calls. This screen did not apply the
replacement to the installed plugin or check a fresh app session.

## Native evidence

Each edited baseline ran Stop twice and blocked once. The block created a native
continuation; its first useful answer is retained as `answer-before-stop.md`, and
its actual final reply is retained as `last-message.md`. Each edited replacement
delivered one PostToolUse reconciliation context before its final reply and had no
Stop registration or execution. The read-only replacement had no reconciliation
context or Stop; the read-only baseline had one nonblocking Stop.

Per-cell `native-evidence.json` derives event order, tool names, outputs and elapsed
times from the exact private wrapper trace. `checks.json` retains the independent
verifier, smoke and patch-formatting results. Every saved final reply matches the
last native agent message. Local wrapper preflights are recorded separately and
cannot satisfy the native execution check.

The [official hook contract](https://learn.chatgpt.com/docs/hooks) explains the
distinction: Stop blocking creates a new user prompt; PostToolUse additional context
arrives as developer context during the active turn. Code-mode nested calls also
use the tool hook path. The actual six runs exercised that contract.

## Conditions and review

Six sequential `codex exec` calls, CLI 0.159.3, requested model `gpt-6-luna`, medium
reasoning. No retries or instruction retuning. Order was baseline/candidate for
the first code pair, candidate/baseline for the second, then candidate/baseline for
the read-only pair. [registered-protocol.json](registered-protocol.json) was frozen
before model calls. The baseline hook files exactly matched the installed cached
plugin; the candidate matched the working source. Frozen hashes stayed unchanged.

Both conditions used identical skill bytes, prompts, fixtures, tools, isolation and
reasoning. The core was read in all six runs. All four code runs read diagnosis and
verification. Only the candidate read-only run read the writing reference; the
baseline read-only run used the core alone. That retrieval difference did not change
the control verdict and does not establish full reference adherence.

The criteria and pass/fail references were retained before calls. Their manual
calibration came from the preceding direct-agent screen with the same task contract.
The independent verifier had accepted a known fix and rejected numeric conversion,
lost spaces and an invented unknown-code default. Grading files and main-repository
context were inaccessible to solver processes under the external sandbox.

The root reviewed the actual last replies against the frozen criteria and checked
all four durable READMEs. [manual-review.json](grading/manual-review.json) retains
the per-criterion verdicts, four rubric scores, blocker flags and quotations. No
model grader ran. This is one unblinded manual review without a variance estimate.
The original runner summary still says manual review was pending; this reviewed
record owns the final decision.

## Setup and reproduction

The earlier project-hook attempt had no native hook events. A new no-model discovery
check found that the CLI project-trust override did not enable the project config
layer. A separate startup wait came from busy real-home session data. This screen
used process-only inline hooks and a separate SQLite directory, preserving actual
HOME, CODEX_HOME and auth identity. No real trust or plugin state was changed.
[Discovery](discovery/outcome.json) independently confirmed four candidate hooks,
all from session flags, with no Stop, global sources, errors or warnings; the exact
Luna slug was available. The project-layer and startup findings are delegated
diagnostic reports, distinguished from retained inline discovery evidence in
[setup-findings.json](setup-findings.json).

[runner.py](runner.py) is the exact runner; [native-hook.py](native-hook.py) preserves
hook stdout, stderr and exit status while recording timing. The hook JSON changed
only its command paths to that common wrapper. `--dangerously-bypass-hook-trust`
applied to the vetted invocation only. Plugins, apps and implicit skill discovery
were disabled; code-mode host and hooks were enabled. The external macOS sandbox
protected real configuration, installed plugins, global skills and other fixtures.
Original fixture files were staged without commits so `git diff --check` examined
the changes. Every owned process group was stopped after capture.

To replay, make a fresh private record with these inputs and a fresh temporary runtime.
Restore the explicit machine-path redaction markers for that machine. Populate
`runtime/plugins/{baseline,candidate}` from the frozen hook inputs and the identical
shared skill, and write that runtime path to `runtime-path.txt`. Copy the two scripts,
protocol, source hashes and verifier, then run `python3 runner.py`. Do not reuse the
populated `cells/` directory. The runner stops on a setup or native-path failure and
never retries an answer failure.

Raw tool output and machine traces stay in ignored `.local/context/`; their public
files contain explicit redaction markers. [results.json](results.json) follows the
shared schema. Per-cell latency uses start/end timestamps for native process wall
time; the original `result.json` latency also includes artifact checks. Usage fields
are raw CLI counters, including cached input; they are not billing or efficiency
claims. Model revision beyond the requested slug and dollar cost were unavailable.
