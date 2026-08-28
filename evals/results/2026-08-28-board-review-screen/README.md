# Board review screen

## Decision

Keep the board workflow as a screened candidate. Simple increased strict passes from
3 of 10 to 7 of 10. No case regressed.

The improvement came from the fallback, majority, and restraint cases. The routing
and fact-flip cases remain inconsistent. This run does not prove reliable model
selection or compatibility reasoning.

## Result

| Case | No skill | Simple |
| --- | ---: | ---: |
| Active rollback routing | 1/2 | 1/2 |
| Closed rollback routing | 0/2 | 0/2 |
| No-delegation fallback | 0/2 | 2/2 |
| Majority trap | 1/2 | 2/2 |
| Routine restraint | 1/2 | 2/2 |
| **Total** | **3/10** | **7/10** |

## Method

Luna and Terra each completed 5 held-out tasks once with no skill. Each model then
completed the tasks with the Simple candidate. The candidate used commit
`28af99b31621cd31f772a93b266403abf5c41692` as its base. The harness disabled
multi-agent support. This setup tested delegation choices and the fallback. It did not
test real child-agent orchestration.

Luna and Terra each graded every anonymous answer. A strict pass required both
graders. Each grader accepted the known pass and rejected the known fail before its
result counted.

The first grade contract required the word `sequential`. It did not test the actual
disclosure that no independent opinion was available. The contract also rejected the
required 2-binary check when an answer did not call it the existing test. We removed
these phrase-dependent requirements. Luna and Terra then graded the unchanged answers
again.

The [runner](run.sh), `mapping.tsv`, `results.tsv`, `results.json`, `raw/`, `events/`,
`errors/`, and `grades/` preserve the run.

## Host-native forward test

A Codex lead started a read-only Luna scout and a Terra challenger with fresh context.
Luna found that the Codex plugin omitted the board prompt. Terra found that the public
command promised independent views when the fallback could not supply them. The
implementation corrected both findings. All 16 repository tests pass.

This test proved direct role and model dispatch in Codex. It did not test autonomous
dispatch by the skill or another host.

## Limit

This result has 1 run per cell. Both models failed the closed-rollback fact flip. Some
answers stated that rollback remained supported after the profile said support had
ended. Test autonomous host-native dispatch. Repeat the fact-flip pair before you
claim reliability across Codex, Claude Code, or OpenCode.
