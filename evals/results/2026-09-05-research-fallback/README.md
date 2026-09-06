# Research and fallback evaluation

This is one sequential trial on `gpt-5.6-luna` with the same isolated Codex
harness and default reasoning for every condition. It compares no skill, the
pre-change Simple snapshot, and the post-change candidate across six cases:
permanent primary failure, transient fallback, unknown mutation, evidence-led
research, maintained-package replacement versus a trivial edit, and structured
identity.

| condition | passed |
| --- | ---: |
| none | 5/6 |
| current | 6/6 |
| candidate | 5/6 |

The grader self-test passed for all six cases, and every grader output contains
the exact three anonymous IDs for that case. The candidate failed only
`unknown-mutation`: its answer included durable state, safe reads, refusal, and
explicit operator resolution, but did not name the existing shared mutation
entry point as the enforcement owner. This is recorded as a negative result;
the single trial does not establish a general skill gain. The owner requested
shipping the upgrade even if this evaluation was poor.

The interrupted first invocation completed 11 answers before relocation; the
resumed invocation preserved those answers and generated only the seven missing
IDs. All solver and grader processes used Luna. The public stderr and JSONL files
contain redaction markers; their originals remain in ignored local context. Anonymous
mapping, raw answers, grader records, and per-workspace skill copies remain here. The pre-change snapshot is
`evals/research-fallback/baseline/skills/simple` (HEAD
`ec76760ef86f9ba2ceb3ddb9d8d8d8ee5563fefd`); the evaluated candidate tree hash
is recorded in `metadata.json`.

The shared normalizer was used with `results.tsv`; its output contains only the
Luna grader verdict because this run intentionally has no Terra grader.

The archived current and candidate workspace copies are authoritative. The
repository's `skills/simple/agents/openai.yaml` changed separately during the
parent rollout; that UI metadata difference is outside the evaluated core
guidance and is recorded by the per-workspace snapshots.

The reviewed local stderr records system-skill install and denied-root messages, plus
state-database `falling_back` warnings. The isolated runner disabled implicit
skill discovery and copied only the selected skill, and the records show no
condition-access change.
