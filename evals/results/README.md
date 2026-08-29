# Evaluation decisions

This index records the current use of each run. `Valid` means that the harness and
grader contract can support the stated decision. It does not mean statistical proof.

| Run | Status | Decision |
| --- | --- | --- |
| [21 August local Sonnet](2026-08-21-local-sonnet/README.md) | Superseded | The baseline received Simple context. Use the isolated rerun. |
| [22 August isolated Sonnet](2026-08-22-isolated-sonnet/README.md) | Valid | Simple passed 6 of 9 cells. The clean baseline passed 3 of 9. |
| [Precedence edit](2026-08-22-precedence-edit-ab/README.md) | Valid negative | The extra sentence did not correct the interaction fault. |
| [Skill interaction](2026-08-22-skill-interaction/README.md) | Valid screen | Ponytail passed 5 of 5 cells. Simple and both-skill arms passed 4 of 5. |
| [Autoresearch cues](2026-08-26-autoresearch-cues/README.md) | Valid negative | No tested Minto or complexity cue earned a runtime change. |
| [First-principles comparison](2026-08-26-first-principles-ab/README.md) | Valid | The candidate corrected a hard interval case and became the current basis. |
| [Prompt-word matrix](2026-08-26-leading-words-matrix/RESULTS.md) | Mixed | The OpenCode run leaked global skills. Use the clean [Codex result](2026-08-26-leading-words-matrix/codex/RESULTS.md). |
| [Problem clarity](2026-08-26-problem-clarity/README.md) | Valid | Keep the problem-shaping and plain-explanation changes. |
| [Proxy screen](2026-08-27-proxy-discipline-screen/README.md) | Valid screen | Simple passed all cells. The extra proxy text tied and did not ship. |
| [Proxy confirmation](2026-08-27-proxy-discipline-confirmation/README.md) | Valid negative | Current and candidate text each passed 28 of 30 cells. |
| [Preservation proof](2026-08-27-preservation-proof-confirmation/README.md) | Valid negative | The extra sentence reduced strict passes from 18 of 24 to 13 of 24. |
| [Repository fact](2026-08-27-repository-fact-profile/README.md) | Valid | A concrete owner and mechanism improved the result from 4 of 12 to 12 of 12. |
| [Profile template wording](2026-08-27-profile-template-wording/README.md) | Valid negative | The template edit tied at 1 of 6. |
| [Profile reference guidance](2026-08-27-profile-reference-guidance/README.md) | Valid | The focused guidance improved the result from 2 of 6 to 5 of 6. |
| [Work-shape screen](2026-08-27-repository-work-shapes-screen/README.md) | Valid negative | The router tied Simple and regressed the Simple and Ponytail condition. |
| [Work-shape activation](2026-08-27-repository-work-shapes-activation/README.md) | Valid negative | Both descriptions opened on all substantive tasks. The candidate opened on more trivial tasks. |
| [Architecture reference](2026-08-27-architecture-reference-confirmation/README.md) | Valid negative | Current passed 12 of 12. The shorter Raptor reference passed 10 of 12. |
| [Profile quality](2026-08-28-profile-quality-confirmation/README.md) | Valid | Evidence, review, and maintenance guidance improved strict passes from 5 of 24 to 9 of 24. |
| [Board review screen](2026-08-28-board-review-screen/README.md) | Valid screen | Optional delegation and evidence synthesis improved strict passes from 3 of 10 to 7 of 10; host-native orchestration remains untested. |
| [Proof-discrimination screen](2026-08-29-proof-discrimination-screen/README.md) | Inconclusive negative | The candidate did not beat current Simple reliably; no-skill answers passed every cell and the regrade exposed grader instability. |
| [Google writing ideas](2026-08-29-google-writing-ideas/README.md) | Inconclusive negative | Contrastive examples did not improve the screen; the actionable-review candidate's apparent gain was a grader false negative. |

Runs from 27 August with a condition map and TSV result now also contain normalized
`results.json` records. Earlier files keep their original format unless the source data
can support a truthful conversion.
