# Research decisions

Each report answers one question. The report keeps its sources and method. This index
records the current decision and the evidence that followed it.

| Report | Current decision | Later evidence |
| --- | --- | --- |
| [Learned priors and the semantic delta](eliciting-priors-and-teaching-the-delta.md) | Use compact cues only after an A/B win. Put current repository facts in `SIMPLE.md`. | The [activation run](../evals/results/2026-08-27-repository-work-shapes-activation/README.md) rejected more task verbs. The [repository-fact run](../evals/results/2026-08-27-repository-fact-profile/README.md) improved from 4 of 12 to 12 of 12. |
| [Cyclomatic complexity audit](cyclomatic-complexity-audits.md) | Use the score to find dense control flow. Do not treat it as total paths or code quality. | The [proxy runs](../evals/results/2026-08-27-proxy-discipline-confirmation/README.md) found no runtime wording gain. |
| [Code metric guardrails](code-metric-guardrails.md) | Select a metric for an observed consequence. Do not install a universal metric stack. | Current Simple passed 38 of 40 proxy cells across 2 runs. The candidate also passed 38 of 40. |
| [Repository workflows in other skills](other-skills-repository-workflows.md) | Keep work shapes as eval lenses. Do not add routes or commands. | The [work-shape screen](../evals/results/2026-08-27-repository-work-shapes-screen/README.md) tied Simple and regressed its Ponytail condition. |

The reports are not runtime instructions. Add a research conclusion to the skill only
when an isolated comparison improves behavior and keeps the proof contract.
