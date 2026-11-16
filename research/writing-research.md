# Writing that preserves the task and its meaning

Decision record, 16 November 2026. Adopt a small clarification of the existing
writing method and repair the review contracts. This is an owner-requested method
improvement, not a demonstrated model-performance gain.

## Scope and inspected evidence

The inspected Simple baseline is `f315d12fe6855e9e17af561875f32d70dadb9a55`;
Communicator is `09e97b5a0962eef67cd77c4c9573bd8caf0023bf`. Forge identified both
repositories. Simple was cloned; all 116 Communicator files were retrieved through
GitHub and their Git blob hashes checked against the complete remote tree.
Neither had an open pull request at inspection. This establishes the inspected
remote snapshots, not the contents of an earlier local working tree.

At those revisions, this file, Communicator's `docs/writing-research.md`, and both
`simple/writing-evaluation-plan.md` files were absent. No earlier contents were
reconstructed or claimed as preserved. The available research index, specialist
references, evaluation protocol and relevant historical results were read first.
This record gives the new decision a durable owner; it is not a replacement for
unseen local research.

Prior evidence remains relevant:

- [Preservation and rollback findings](simple-skill-ideas.md#preservation-and-reference-led-development--6-september-2026):
  executable checks passed prose that invented release state after reading the
  profile and writing reference. The cause was not established.
- [Learned priors](eliciting-priors-and-teaching-the-delta.md): a clear cue can state
  a wanted concept without proving that it improves adherence. Context size and
  retrieval are separate from use of the retrieved information.
- [Instruction audits](instruction-audits-2026-09.md) and
  [Google Testing Blog review](google-testing-blog.md): retain useful boundaries,
  counterexamples and negative/tied results; do not optimize wording for a proxy.
- [Human-understanding screen](../evals/results/2026-10-02-human-understanding/README.md):
  an artifact can remain correct while a continuation loses the requested answer.
  That narrow screen did not establish a general improvement.

## Testable explanation

**Observed problem.** Simple's writing defaults and shared rubric sometimes prescribe
a form regardless of the requested operation. The reference's last-request rule
also conflicts with the core's active-task continuity. Communicator carries the
objective and semantic constraints into composition, but its ordinary review
previously dropped them. Its anonymous evaluation artifact omitted the source.
Its example ranker could let approved standalone messages displace an approved
correction despite the skill's stated priority.

**Candidate mechanism.** Keep the requested operation, purpose, source and constraints
available at the point of writing and checking. Derive only the decisive questions
from that evidence. Compare required source content with the draft for omissions,
and draft assertions with the source for additions or changed strength. Repair
identified failures; leave satisfactory wording alone. A short internal check does
not require another model call, a visible reasoning transcript, or human questions
when the necessary substance is already supplied.

**What would contradict it.** Under matched, frozen conditions, the candidate might
miss the same semantic errors, introduce more unnecessary changes, worsen personal
voice, lose scoped instructions, or cost more without a useful outcome difference.
If traces show that the reference was never read, changing its wording cannot explain
an observed gain. If a complete one-pass brief performs equally well, an extra review
stage has no demonstrated value. Keep those outcomes, including individual regressions.

**Simplest useful alternative.** Supply the same purpose, source, relevant examples
and constraints in one instruction: edit for the reader and requested operation;
preserve who does what, conditions, commitments and unknowns. This is the short
control for any future comparison. Do not give the candidate facts withheld from
the control and credit the resulting difference to self-review.

## Evidence that changes the design

| Primary source | Mechanism and limit | Decision here |
| --- | --- | --- |
| [Anthropic prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), inspected 16 November 2026 | Vendor guidance recommends clear goals, constraints and relevant examples. It is not a matched evaluation of these repositories. | Carry task context; do not add an obligatory interview or example quota. |
| [LaMP, ACL 2024](https://aclanthology.org/2024.acl-long.399/) | Retrieval from user profiles improves studied personalized tasks; retrieval choice matters. Its metrics and tasks do not establish an individual's voice quality in arbitrary prose. | Retain scoped, approved examples; evaluate their relevance and provenance separately from fluency. |
| [QAEval, TACL 2021](https://aclanthology.org/2021.tacl-1.47/) | Reference-derived questions test information overlap beyond literal wording. Question quality, answerability and answer comparison remain failure sources. | Accept faithful paraphrases. Ask about required relationships, not merely recurring names or numbers. |
| [QAFactEval source](https://github.com/salesforce/QAFactEval/blob/master/qafacteval.py), inspected 16 November 2026 | Generates questions from summaries and checks their answers against the source. That direction checks unsupported content, not all source omissions. Code was inspected, not executed here. | Keep both source/request-to-draft and draft-to-source checks. Do not import its model stack or threshold. |
| [Huang et al., ICLR 2024](https://arxiv.org/abs/2310.01798v2) | Intrinsic self-correction can fail or degrade studied reasoning outputs. Revision prompts can confound comparisons by adding requirements missing from the initial prompt. | Stop when no concrete failure is found; use the same information in the one-pass control. |
| [ProCo, EMNLP 2024](https://aclanthology.org/2024.emnlp-main.714/) | Verification against a known masked condition improves studied reasoning tasks. Short problems with entity/number answers are not open-ended prose. | Known-condition checks are a testable lead, not proof that iterative rewriting works here. |
| [Lost in the Middle, v3](https://arxiv.org/abs/2307.03172v3) | Relevant information's position affects studied long-context tasks. This is not a direct test of skill activation or editorial adherence. | Record delivery/read evidence separately from use and task outcome. |
| [Style-personalization evaluation, v4, 1 September 2026](https://arxiv.org/html/2508.06374v4) | Style resemblance, preference and copy-editing usefulness are distinct. First-person author judgement is not fully captured; several apparent metric/ensemble differences fall within uncertainty. | Keep voice, fidelity, usefulness and reader understanding separate. Do not introduce an ensemble or embedding threshold. |
| [MT-Bench / Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685v4) and [FastChat judging code](https://raw.githubusercontent.com/lm-sys/FastChat/main/fastchat/llm_judge/common.py), inspected 16 November 2026 | Judges exhibit position, verbosity and other biases. The code evaluates both orders and records mapped judgments. It was not executed here. | Anonymous candidates, ties/rejection and recorded order disagreements belong in evaluation; agreement is still fallible. |

Two writing products supply implementation precedents, not independent performance
evidence. [Grammarly's Paraphraser](https://support.grammarly.com/hc/en-us/articles/38552469933837-Paraphraser-agent-user-guide)
accepts writing samples for a selectable custom voice and lets the user accept,
dismiss or undo suggestions. [QuillBot's modes](https://help.quillbot.com/hc/en-us/articles/35854318883351-What-are-modes-in-the-Quillbot-Paraphraser-and-how-do-I-use-them)
make the rewrite objective explicit; its Creative mode acknowledges possible meaning
changes. Neither page demonstrates fidelity or personal-voice gains for this change.
No writing was submitted to either product.

## What belongs in each repository

Simple owns clear software reasoning, implementation explanations, decisions,
updates and handoffs. Its core retains the compact method; `references/writing.md`
owns operation-specific details and the bounded internal check. A punctuation-only
edit must not inherit a reporting wrapper. An explanation must not collapse into a
verdict. The current retry-writing pass reference is corrected to avoid asserting
unobserved implementation work; historical frozen answers and grades stay unchanged.

Communicator owns the writer's voice and approved writing evidence. Its existing
compose/review schemas carry an optional operation and the actual request; examples
remain distinct from current facts and recipient context. Its deterministic review
reports lexical and narrow operation checks, with semantic preservation and task
fulfilment still unassessed. The host agent performs the substantive comparison.
Its existing evaluator retains the source/task evidence behind anonymous answers,
and permits ties, rejection and an explicit order check. See the
[Communicator decision](https://github.com/timc0y/communicator/blob/writing-method-2026-11-16/docs/writing-research.md).

The projects share principles and synthetic failure cases, not a runtime dependency.
No new personal-context store, inferred preference persistence, training pipeline,
model, detector or generic banned-word service is introduced. An API/SDK is an
integration interface, not evidence that a particular model is released or available.

## Separate the claims being checked

| Question | Appropriate evidence | Insufficient substitute |
| --- | --- | --- |
| Was an exact requested constraint met? | Exact text, schema, count or operation check with stated scope | A model's confidence or semantic similarity |
| Is the draft faithful to the relevant source? | Claim/relationship comparison in both directions, including conditions and unknowns | Matching names/numbers; every remaining sentence being individually true |
| Is the source itself true? | Independent external or repository evidence when the task calls for verification | Faithfully repeating the source |
| Does the draft fulfil the request? | The requested operation and purpose; independently assess whether the problem was solved | An unchanged draft, nonempty diff, shorter text or fewer lexical flags |
| Does it sound like this person? | Relevant approved examples and the person's scoped judgement | Natural wording, recipient style, slang, intentional mistakes or a detector result |
| Can the reader understand and use it? | Questions about the task's decisions/conditions, or a realistic task by the intended reader | A preference win or automated readability score |
| Did the skill reach the agent? | Observed source identity and reference reads in the actual host | Repository file existence or a version label |
| Is the result approved? | Applicable human approval for that result and use | A generated draft, a review pass or saving an unrelated example |

A factual correction updates the current authoritative material; it does not create
a universal style rule. A later style edit must preserve that correction. An explicit
replacement can retire an earlier approved example within its existing scope;
mere recency cannot. Forgetting keeps its documented, explicit target semantics.

## Verification and spending boundary

The [writing-method protocol](../evals/writing-method/protocol.md) reuses the existing
Luna case layout. Synthetic cases cover relationships, missing conditions, certainty,
no-op decisions, narrow punctuation, corrections, long-range qualifications and
unknowns. Parser tests check the evaluator's integrity, not its semantic accuracy.

For this change, the separately billed model/API evaluation budget is **$0 and zero
calls**. No paid comparison, training or private-writing export is authorized. Native
collaboration is used for bounded inspection and independent code review. Any native
skill-use smoke task is a separate, bounded delivery observation, not a matched gain
experiment or an installed supported-host pass. Full model evaluation remains gated
by `evals/README.md`, its isolation requirements and an explicitly registered budget.

Before a future improvement claim, freeze current, candidate and short-control
instructions, the same task/source/examples, host/tools/model identity and reasoning
setting. Measure duplicate-baseline variation; keep held-out cases and original
acceptance criteria. Record all planned cells, failed attempts, usage and order
disagreements. Stop at the registered limit or a concrete invalidity; never extend a
run until a preference appears. Exact model revision or usage that is unavailable
must remain unknown.

The [verification record](../evals/results/2026-11-16-writing-method/README.md) owns
the actual commands, results and delivery limits. It must not convert deterministic
checks or a small smoke task into a claim of better model behaviour.
