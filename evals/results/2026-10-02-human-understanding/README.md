# Human-understanding initial screen

Both conditions passed 2 of 4 tasks. Both lost the useful answer after synthetic continuation feedback; both passed the two single-turn format tasks. All eight final-file checks passed. No baseline-pass/candidate-fail pair occurred. This one-repeat screen demonstrates no wording gain.

The owner requested two instruction changes after discussing [Karpathy’s post about understanding model outputs](https://x.com/karpathy/status/2105819303471976479): preserve the active request and decisive facts in the final response, and give interaction or motion a concrete reader purpose. Adoption follows that request, independently of these scores.

| Capability | Instruction | Observed evidence and limit |
| --- | --- | --- |
| Preserve the requested answer through internal checks. | `SKILL.md`, final writing check. | Both continuation cases produced cleanup-only final replies under both conditions. The files remained correct; the requested result, proof or limit did not survive in the last answer. |
| Choose a useful form while preserving facts and uncertainty. | `references/writing.md`, existing visual guidance. | Both conditions kept status concise without generating files, and used a correct formula/table for varying inputs while preserving unmeasured item time. No interactive artifact, animation or reader comprehension was tested. |

## Conditions and checks

Twelve sequential calls used requested `gpt-5.6-luna`, medium reasoning and Codex CLI 0.159.3. Model revision was not exposed. Two cases used a seed exec and actual exec/resume; two used one exec. Each condition ran each case once, with alternating order.

The [frozen complete skills](inputs/) differ only in `SKILL.md` and `references/writing.md`. They include the same preexisting working-tree example changes. Commit `3270463a94ec7367507b376303594e32b9162277` is provenance, not a claim that either condition equals HEAD. [Hashes](freeze-verification.json) retain exact inputs.

Native hooks were disabled. Both continuation arms received the identical old Stop reason as a **synthetic late user-role message**, with the exact `Lifecycle feedback:` prefix, after the seed completed. This tests recovery from that message; it does not reproduce a native callback or reminder timing. Only the actual last answer was graded.

[Preregistered criteria](graders/), eight pass/fail references and seven artifact mutations passed preflight. `npm run test:behavior` passed before solver calls. [Manual final-only review](manual-review.json) agrees with every screening flag. The reviewer scored candidate readability one point lower on both form cases: status 3 versus baseline 4, and varying inputs 4 versus baseline 5. These are single unblinded samples with no measured noise floor; the differences do not establish a cause. [Normalized results](results.json) link each task to its checks; exact synthetic answers, fixture files, retrieval observations, CLI usage counters and latency are retained beside them. No Luna grader calls were made.

## Limits and retained evidence

Every seed read its assigned core skill. Both varying-input arms read the writing reference; the baseline status arm read commands and delivery instead. System-skill setup/read warnings occurred under the isolation restrictions. Assigned local reads succeeded, and no condition access difference was observed. [Private traces are explicitly redacted](REDACTED.md); originals remain in the ignored local record.

Summing the CLI-reported per-call usage counters gives 1,135,151 input tokens, including cached tokens, and 18,940 output tokens across 12 calls. Whether resume counters are cumulative is not established; the retained snapshots do not prove distinct billed consumption or efficiency. Aggregate process latency was 321,996 ms. No failures were retried and no criteria were changed. Native finishing behavior, installed-plugin behavior, live UI and human comprehension remain unverified.
