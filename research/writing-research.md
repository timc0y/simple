# Writing, meaning and evaluation research

Recorded 16 November 2026. This catalogue preserves the references followed in the
owner's writing/coding research and subsequent Simple/Communicator planning. It is
self-contained; no private transcript or other checkout is needed. The separate
[Simple implementation plan](../simple/writing-evaluation-plan.md) owns the proposed
work. Current research decisions remain in [the research index](README.md).

For Simple, use these sources to test explanation, preservation, audience adaptation,
learning from corrections and evaluator reliability in existing owners. Personal
voice selection and storage belong to Communicator, not the shared Simple method.
Nothing in this file adopts a new runtime rule or establishes a model gain.

## Posts supplied by the owner

These external posts were supplied in the conversation. Tracking parameters
are omitted from the canonical links; the status identifiers are unchanged.

- **Thomas Ankcorn:** [agent-update before-and-after](https://x.com/thomas_ankcorn/status/2119746237050101777). Prompted the investigation of outcome-first updates, BLUF, SBAR and Simplified Technical English. The screenshot is a presentation example, not a controlled test of correctness or reader comprehension.
- **Julian Harris:** [Edison scientific-writing/RAL post](https://x.com/julianharris/status/2122186120159244746). The attached Pangram screenshot labels one abstract human-written. It is an illustration of one detector outcome, not proof of factual accuracy or personal voice.
- Harris quotes [Andrew White's original announcement](https://x.com/andrewwhite01/status/2120587615745474703). This was followed from the supplied post, rather than supplied separately by the owner. Check model roles against the actual experiment: its writer is Qwen3-32B and judge is Qwen3-235B-A22B.
- **Erin Meryl McGurk:** [Ink demonstration and reply](https://x.com/erinmerylstudy/status/2121917828735578122). Links a specialised rewriting product and quotes [Ben Dicken's writing-skill experiment](https://x.com/BenjDicken/status/2121735890934583784). The [Ink investigation](#ink-and-the-third-supplied-post-16-november-2026) separates detector screenshots, published retention counts and personal-voice claims.

## Clear explanations, updates and handoffs

- [US Army writing guidance, AR 25-50](https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN42124-AR_25-50-007-WEB-13.pdf): outcome-first operational writing and BLUF, meaning the bottom line comes first. It does not establish one compulsory format for every reply.
- [AHRQ SBAR](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html): situation, background, assessment and recommendation as a communication aid.
- [AHRQ I-PASS](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html) and [handoff guidance](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html): retain actionable state and responsibility; acknowledgment is not independent verification.
- [AHRQ/NCBI handoff material](https://www.ncbi.nlm.nih.gov/books/NBK613742/): additional handoff context followed in the early research pass. Healthcare findings are not direct coding-agent evidence.
- [Google SRE incident management](https://sre.google/sre-book/managing-incidents/): explicit current state, roles and handoff responsibility.
- [Gopen and Swan, The Science of Scientific Writing](https://www.cs.tufts.edu/comp/150FP/archive/george-gopen/sci.html): connect familiar information to new information and place emphasis deliberately.
- [Google technical-writing editing guidance](https://developers.google.com/tech-writing/two/editing): place conditions before actions and organise explanations for readers.
- [Worked-example research review](https://link.springer.com/article/10.1007/s10648-019-09465-5): adjust instructional support to expertise; learning research does not establish the best format for every agent response.
- [Karpathy's model-output understanding post](https://x.com/karpathy/status/2105819303471976479): an earlier related precedent mentioned during the thread, rather than a separately supplied post.

## Simplified English, checker corrections and reader understanding

- [Official ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) and [ASD-STE100 and AI white paper](https://www.asd-ste100.org/assets/files/WhitePaper-ASD-STE100_and_AI.pdf): distinguish the actual controlled-language standard from an informal AI prompt. Preserve necessary terminology and uncertainty.
- [Community Simplified Technical English skill](https://github.com/0xpili/simplified-technical-english/blob/main/SKILL.md): examined as a reference, not installed or adopted. Its older-edition basis and word-replacement rules need checking against the current task.
- [Ghinda's experiment correction](https://github.com/lucianghinda/llm-experiments/blob/main/simplified-technical-english/ADJUDICATION.md) and [native-provenance limits](https://github.com/lucianghinda/llm-experiments/blob/main/simplified-technical-english/RUN-NATIVE-PROVENANCE.md): keyword checks can reject valid paraphrases; regrading mainly missed matches does not validate all earlier passes.
- [Ovhal's experiment report](https://github.com/prasadovhal/ai-playground/blob/main/prompting/RESULTS.md) and [implementation](https://github.com/prasadovhal/ai-playground/blob/main/prompting/src/asd.py): freezing underlying answers separates writing changes from task-solving changes. Model ratings and shorter sentences are not human comprehension results.
- [Agrawal and Carpuat, Do Text Simplification Systems Preserve Meaning?](https://aclanthology.org/2024.tacl-1.24/): assess what readers can recover through comprehension questions, including unanswerable questions.
- [Cripwell et al., Evaluating Document Simplification](https://aclanthology.org/2024.readi-1.1/): assess simplicity and meaning preservation separately.
- [Devaraj et al., Evaluating Factuality in Text Simplification](https://aclanthology.org/2022.acl-long.506/): omissions and unsupported substitutions need explicit attention.
- [InfoLossQA](https://aclanthology.org/2024.acl-long.234/): questions can expose information lost through deletion or vagueness; automatic detection of that loss remains imperfect.
- [QAGS](https://aclanthology.org/2020.acl-main.450/): question answering compares factual information between source and summary. It is a methodological lead, not a validated checker for these repositories.

## Meaning, social intent and judge reliability

- [Mind the Style Gap](https://aclanthology.org/2025.findings-emnlp.1175/): a test set can make weak content-preservation metrics appear reliable. Include faithful stylistic changes and misleading near-identical wording.
- [Facilitating the Communication of Politeness](https://aclanthology.org/2020.emnlp-main.416/): sender intention and recipient perception depend on the communication circumstance. Request force, courtesy and commitment cannot be reduced to topic similarity.
- [TofuEval](https://aclanthology.org/2024.naacl-long.251/): dialogue-summary factuality and errors involving attribution, modality and relationships. Its model results are limited to the tested systems.
- [PersEvalBench](https://arxiv.org/html/2610.19314v1): independent judgments of appropriate personal-context use are harder than explicit paired comparisons; structured prompts can shift false alarms without improving judgment. Synthetic controlled scenarios do not certify deployment reliability.
- [LLM evaluators' self-preference study](https://aclanthology.org/2024.acl-long.826/): investigate independence when the generator also evaluates its own outputs.
- [Judge position-bias study](https://aclanthology.org/2025.ijcnlp-long.18/): conceal identities and test candidate-order effects.
- [Crowdsourcing factual-consistency evaluation](https://aclanthology.org/2022.naacl-main.417/): evaluation design affects reliability; ranking and absolute assessment answer different questions.
- [Bansal et al., explanations and complementary team performance](https://arxiv.org/html/2006.14779v3) and [Vasconcelos et al., explanations and overreliance](https://cicl.stanford.edu/papers/vasconcelos2023explanations.pdf): making an answer persuasive differs from making it cheap to verify.
- [Human experiment on uncertainty wording](https://arxiv.org/html/2405.00623v2) and [Yona et al., expressed uncertainty](https://aclanthology.org/2024.emnlp-main.443/): expressed doubt and calibrated uncertainty are different properties.

## Personal style, retrieval and learning from revisions

- [PEARL](https://aclanthology.org/2024.customnlp4u-1.16/): select historical examples for their effect on generated writing. The older model choices, limited scenarios and private enterprise dataset constrain transfer and reproducibility.
- [RAGs to Style](https://aclanthology.org/2024.personalize-1.11/): style-based selection is a candidate comparison to topic matching, not proof of a benefit for one writer.
- [Refocusing on Relevance](https://aclanthology.org/2021.emnlp-main.421/): a relevance/personalisation source cited in the earlier retrieval investigation; reread its task and assumptions before relying on it for a new design.
- [LaMP benchmark and temporal splits](https://lamp-benchmark.github.io/download): separate earlier personal history from later evaluation; different record IDs alone do not establish separation.
- [Personalised-writing evaluation, arXiv:2508.06374v4](https://arxiv.org/html/2508.06374v4): earlier research on distinguishing personalised from generic output; retained as a bibliographic lead, not freshly re-audited evidence.
- [Catch Me If You Can?](https://aclanthology.org/2025.findings-emnlp.532/) and its [full paper](https://aclanthology.org/2025.findings-emnlp.532.pdf): evaluate individual authorship separately from AI detection. Topic-based selection, length matching and more examples have mixed effects across measures; target-text-based selection differs from writing from rough notes.
- [Author Writing Sheets / Whose story is it?](https://aclanthology.org/2025.ijcnlp-long.82/): infer inspectable style claims with supporting evidence. Story generation is not a test of faithful professional-message rewriting.
- [StyleVector](https://aclanthology.org/2025.acl-long.353/) and its [full paper](https://aclanthology.org/2025.acl-long.353.pdf): activation steering requires model-internal access despite being training-free. The authors identify incomplete style/content separation and mixed-domain style as limitations.
- [PRELUDE/CIPHER](https://arxiv.org/html/2404.15269v3): infer contextual preference descriptions from edits without weight training. Main experiments use simulated users; section 4.4 also contains small human evaluations. Do not describe the evidence as exclusively simulated.
- [Can AI writing be salvaged?](https://arxiv.org/html/2409.14509v5): professional edits, writing idiosyncrasies and differences in intervention level. Its threshold-based meaning categories are not a semantic guarantee.
- [Understanding Iterative Revision / ITERATER](https://aclanthology.org/2022.acl-long.250/): distinguish edit intentions such as fluency, clarity, style and meaning change.
- [How LLMs Distort Our Written Language, v2](https://arxiv.org/html/2603.18161v2), with [v1](https://arxiv.org/html/2603.18161v1) retained for version provenance: studied editing can change argument and voice even under limited-edit prompts. Embedding movement or observational associations alone do not establish every semantic or causal claim.
- [OP-Bench](https://aclanthology.org/2026.emnlp-main.1168/): irrelevant, repetitive or excessively agreeable personalisation; knowing a personal fact does not make it relevant.
- [Evaluating the Hidden Costs of Personalization](https://aclanthology.org/2026.emnlp-main.679/): additional evidence on irrelevant personal information, preference narrowing and agreement bias; conversational findings are not direct writing-plugin measurements.

## Edison RAL and adversarial learning

- [Edison research article](https://advances.edisonscientific.com/research/reinforced-adversarial-learning/): the authors' explanation, examples and stated source-grounding limitation.
- [RAL paper and version history](https://arxiv.org/abs/2610.38851), [v3, 10 November 2026](https://arxiv.org/html/2610.38851v3), [v3 PDF](https://arxiv.org/pdf/2610.38851v3), and [earlier v1](https://arxiv.org/html/2610.38851v1): use version-specific claims. The writing task evaluates resemblance to real abstracts, not faithful reporting of supplied results. V3 reports confidence intervals; the human-rater count was not located in the inspected material.
- [Released repository](https://github.com/EdisonScientific/prime-rl-adversarial-paper) and [method README](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/README_PAPER.md): positive references plus model-generated negatives, with a co-trained writer and judge. This is weight training, not a prompting technique.
- [Pinned NIH experiment configuration](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/configs/paper_experiments/adversarial/nih/32b235b.toml) and [experiment launch guide](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/configs/paper_experiments/README.md): model roles, configured deployment and data path. A configured GPU allocation is not measured duration or expenditure.
- [Abstract environments, including rewriting](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/src/prime_rl/adversarial/environments/abstracts.py): the rewrite environment requests preservation, but its existence is not a reported successful evaluation.
- [Judge implementation](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/src/prime_rl/adversarial/environments/judge.py), [orchestrator](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/src/prime_rl/adversarial/orchestrator.py) and [replay buffer](https://github.com/EdisonScientific/prime-rl-adversarial-paper/blob/9c5e1eda24345150680e5c2735f98177f5f895bd/src/prime_rl/adversarial/replay.py): adaptive judging, old generated examples and training stabilisation. These mechanisms are research references, not proposed runtime dependencies.
- [Public NIH dataset](https://huggingface.co/datasets/EdisonScientific/grant-abstracts-NIH-fy2026), [medical abstracts](https://huggingface.co/datasets/EdisonScientific/paper-abstracts-medicine), and [official model catalogue](https://huggingface.co/EdisonScientific): code, dataset and trained-model availability are separate questions.
- [Prepared NIH dataset named by the config](https://huggingface.co/datasets/EdisonScientific/grant-abstracts-NIH-fy2026-sft): the public request returned 401 on 16 November; its contents were not verified. This does not distinguish a private, unavailable or missing resource.
- [GAIL](https://arxiv.org/abs/1606.03476) and [AIRL](https://arxiv.org/abs/1710.11248): background on learning from demonstrations; original control-task evidence is not personal-writing evidence.
- [TextGAIL](https://ojs.aaai.org/index.php/AAAI/article/view/17656) and [code](https://github.com/qywu/TextGAIL): text-generation quality and diversity; a predecessor rather than proof of source-preserving editing.
- [RARO / Escaping the Verifier](https://arxiv.org/html/2511.21667v1): demonstration-based training with pairwise comparisons and ties.
- [R-AIRL](https://arxiv.org/html/2510.01857v5): learns reasoning rewards from expert traces; unlike RAL it requires reasoning demonstrations.

### Dated independent check of public NIH data

On 16 November 2026, the downloaded public files had 20,000 training rows and 128
validation rows. Five validation title-and-abstract pairs were byte-identical to
training pairs, despite different project IDs. Case/whitespace normalisation gave
the same result. This check establishes overlap in those public files, not leakage
in the authors' experiment. The paper explicitly documents removing five duplicates
for its SFT baseline; the RAL configuration requests 19,995 rows from a separately
prepared dataset that could not be inspected publicly.

File SHA-256 identities:

- Training parquet: `26a57402efc1f1fe9b0dd5651be0187a081b4efd4edbb98dfd9f0f5a30f48ffd`.
- Validation parquet: `b449d5e78a607e3c27f7f8d7ab42a0c3d0450b15582208d1a2dac5391db3d8ce`.

No full training run, checkpoint evaluation or independent human study was performed.
No RAL-specific writer/judge weights were identified in the inspected official
catalogue at that date; that is a dated inspection result, not a permanent absence claim.

## Coding and verification techniques from the earlier research pass

- [Fowler, preparatory refactoring](https://martinfowler.com/articles/preparatory-refactoring-example.html): remove a concrete obstruction before the behaviour change; not a reason for speculative restructuring.
- [Bernhardt, functional core and imperative shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell): separate decisions from external effects where it reduces actual testing and maintenance work.
- [Alexis King, Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/): retain established constraints in the representation rather than repeatedly forgetting and rechecking them.
- [Cleve/Zeller delta-debugging source cited earlier](https://arxiv.org/abs/cs/0012009): systematic reduction of a failure; verify exact bibliographic attribution before a new public claim.
- [Metamorphic-testing source cited earlier](https://arxiv.org/abs/2211.12003): investigate relationships between changed inputs and outputs when a full expected answer is difficult to specify; do not assume a relation without a contract.
- [Google, change-detector tests](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html): test requested behaviour rather than copying implementation structure.

## Further repository investigation, 16 November 2026

This pass inspected ten additional repositories. Repository identities were resolved
through GitHub's API, then selected source files, READMEs and tests were read at the
commits linked below. Trees were not truncated. This is targeted source inspection,
not an exhaustive audit or a run of the upstream software. No upstream package,
checkpoint, dataset archive or executable was installed or run. No private writing
was supplied to the research service.

Parallel helped discover sources; implementation conclusions below were checked
against the linked files. Its generated synthesis incorrectly described PRELUDE as
exclusively simulated, despite the previously inspected paper's small human section.
That claim is not adopted. Discovery summaries do not replace the source.
Parallel research response: `resp_6bf2c438-d849-4a3c-a2eb-e56df3424c4a`.

### Preference learning and example selection

**1. Apple PROSE / ml-predict.** [Preference inference](https://github.com/apple/ml-predict/blob/39333a118260cb87cddb9a1cf7ebd8cf831dcc1f/preference_inferrer/preference_inferring_agents/prose.py)
retrieves relevant earlier examples, infers descriptions from a writer's result and
an optional comparison, can generate further comparison drafts, and validates
individual preferences against the current and retrieved examples. It caches
validation results and records prompt counts and parsing errors. The useful idea is
to test an inferred preference against more than the edit that suggested it.

The [retriever](https://github.com/apple/ml-predict/blob/39333a118260cb87cddb9a1cf7ebd8cf831dcc1f/preference_inferrer/preference_inferring_agents/example_retriever.py)
also has an `exact_match` mode that uses the known document source, explicitly called
oracle knowledge in the code. That mode cannot be presented as ordinary retrieval
from rough notes. Confirmation by an LLM remains inferred evidence; repeated related
examples do not establish a universal preference. Cached confirmation would need
reconsideration after an example is replaced or forgotten.

The [README](https://github.com/apple/ml-predict/blob/39333a118260cb87cddb9a1cf7ebd8cf831dcc1f/README.md) supplies experiment configuration
and seeds; its `test_llm.py` is described as a prompt-viewing tool, not a regression
suite. The [licence](https://github.com/apple/ml-predict/blob/39333a118260cb87cddb9a1cf7ebd8cf831dcc1f/LICENSE) is Apple's own licence,
not MIT or Apache; GitHub reports `NOASSERTION`. Retain attribution and inspect terms
before copying code. The [paper](https://arxiv.org/abs/2505.23815) is a follow-up lead
for checking benchmark design; no reported percentage is treated as a local gain.

**2. PRELUDE/CIPHER.** [The actual agents](https://github.com/gao-g/prelude/blob/85c3061867813bfd864539420fdf0dee10fda721/src/agent/cipher.py)
infer a preference when an edited answer differs, store it with its context, and
retrieve one or several earlier preferences for the next task. The multi-example
agent asks the LLM to aggregate retrieved preferences. This supplies a small baseline
for descriptive learning without changing model weights.

The implementation does not establish whether a changed date was a style preference,
nor whether the inferred rule remains valid after contradictory edits. Compare a
factual correction and a genuine style edit with similar visible changes. The
repository has an Azure model test file and experiment scripts; those do not establish
semantic preservation. MIT code licence. Preserve the paper's distinction between
its main simulated experiments and small human section.

### Claim support and missing information

**3. MiniCheck.** [The scoring API](https://github.com/Liyan06/MiniCheck/blob/b58b9fa69acbd1015ec970fa65dd752413a053d2/minicheck/minicheck.py)
takes documents and claims, returns supported/unsupported labels, support
probabilities and document chunks. In the inspected non-LLM path, the label uses the
maximum support probability with a 0.5 threshold. The
[README](https://github.com/Liyan06/MiniCheck/blob/b58b9fa69acbd1015ec970fa65dd752413a053d2/README.md) recommends sentence-level claims and
ships a benchmark notebook rather than a visible unit-test suite.

A supported surviving claim says nothing about an important source sentence omitted
from the draft. A high-support chunk also does not prove the whole document is free
of contradictory qualifications. Useful experiment: hold claim support fixed while
removing a material condition, and see whether the separate completeness check notices.
Apache-2.0 repository code; check each checkpoint's separate terms before use.
No model accuracy or threshold suitability was measured here.

**4. AlignScore.** [The inference implementation](https://github.com/yuh-zha/AlignScore/blob/a0936d5afee642a46b22f6c02a163478447aa493/src/alignscore/inference.py)
splits source material into chunks and the candidate into sentences, takes each
candidate sentence's maximum alignment across chunks, then averages. This explains
the direction of the main score and identifies two tests: an omitted obligation and
one serious failure among many easy sentences. Averaging can hide the latter; that
is a property to test, not a measured error rate.

Reverse-direction checking is a proposed experiment, not an established complete
meaning test. Ordinary summaries legitimately omit material, and changing argument
order can affect chunk evidence. MIT repository licence; benchmark and training
scripts were visible in the tree, but no dedicated test suite was identified.

**5. QAFactEval.** [The implementation](https://github.com/salesforce/QAFactEval/blob/01177f11cc05f8b3e75511a0cfa54bac19324d09/qafacteval.py)
generates questions from summaries, checks that the questions are answerable in
those summaries, filters them, and answers surviving questions against the source.
It can return question/answer evidence. It is therefore not automatically a check
that source obligations survived: a deleted obligation may never generate a question.
The code also notes a first-summary-only consistency check.

Reuse the inspectable question/evidence idea with independently chosen source
questions. Assess question quality and discarded questions; an empty retained set
must not quietly mean complete coverage. BSD-3-Clause root code licence with a
separate bundled `qaeval/LICENSE`; the
[setup instructions](https://github.com/salesforce/QAFactEval/blob/01177f11cc05f8b3e75511a0cfa54bac19324d09/README.md) require additional
models and dependencies. No dedicated test suite was identified in the tree.

### Editing scope and revision data

**6. EditEval.** [Task instructions](https://github.com/facebookresearch/EditEval/blob/013cd20aa73be0016041201454b3fcd7c2250fb4/src/prompts.py)
separate fluency, clarity, coherence, neutralisation, paraphrasing, simplification
and factual updating. Several ordinary instructions appear under different task
labels: the requested outcome must remain in the review evidence rather than being
inferred from a generic word such as “clearer”.

The [tests](https://github.com/facebookresearch/EditEval/blob/013cd20aa73be0016041201454b3fcd7c2250fb4/src/tests/test_metrics.py) check
metric calculations and agreement with metric implementations. They do not establish
that a particular edit preserves promises or personal voice. The repository was
archived when inspected; GitHub identifies its root licence as CC0-1.0. Linked
datasets retain their own access and licence requirements. Use the task distinctions,
not an unrequested replacement evaluation framework.

**7. IteraTeR / DElIteraTeR.** The
[repository documentation](https://github.com/vipulraheja/iterater/blob/41adc0818356f78b362a9382a3732e0529f3fe35/README.md) exposes sentence
and document revision datasets, intent classification, iterative generation, and
multi-sentence editing. It is useful for distinguishing where to edit from how to
edit and for keeping revision sequences together when separating evaluation material.

The documented token-tagging example includes `meaning-changed` but explicitly says
that class is not used in that path. Its presence in a label list does not establish
an implemented meaning-change detector. Academic/news/Wikipedia revision data also
does not establish an individual's Slack voice. Apache-2.0 repository code; dataset
terms and original sources require separate checking. No dedicated unit-test suite
was identified; inference/evaluation scripts are not equivalent to one.

**8. CoEdIT.** The [official release](https://github.com/vipulraheja/coedit/blob/a28dcacc23eac8e35a4db862dbf0ab98701053dd/README.md)
provides task-specific editing examples and training instructions. Its public data
has about 69,000 instances, whereas the paper used about 82,000; the README attributes
missing simplification and formality examples to licensing restrictions. Do not claim
that the public release exactly reproduces the paper's training conditions.

The five-file tree did not expose a root licence or dedicated tests. Treat it as a
source of task-design ideas until permissions are established; do not copy its code
or examples by assumption. Instruction-tuned editing models are a different
intervention from improving the existing prompts.

### Behavioural cases and evaluator failure

**9. CheckList.** [MFT, INV and DIR](https://github.com/marcotcr/checklist/blob/4e6e5e33a26f30c20ed602b2050f6c73e123cc23/checklist/test_types.py)
separate minimum functionality, invariance under a change that should not matter,
and a known direction of change. Each can take a custom expectation. The useful
transfer is a family of nearby writing cases, not requiring generated wording to
remain identical. Keep names consistent across source and rewrite; change a date
only when both occurrences should change; flip an approval condition to require a
different answer.

The packaged paper suites concern sentiment, paraphrase identification and question
answering, not faithful professional-message editing. Their default class/probability
expectations need task-specific replacements. MIT repository licence; notebook
demonstrations and released test suites are available. No suite was executed here.

**10. Inspect AI.** [The model grader](https://github.com/UKGovernmentBEIS/inspect_ai/blob/59c1340741ba863fb0d79287f66420e5dd782480/src/inspect_ai/scorer/_model.py)
makes grader roles explicit, validates the final verdict against allowed labels,
leaves an unparseable verdict unscored, and uses per-request random markers around
fields. The inspected majority reducer counts against the original panel size;
missing grades do not reduce the votes required. Its optional `mode` reducer has
different tie behaviour, so reducer choice changes the claim.

The [tests](https://github.com/UKGovernmentBEIS/inspect_ai/blob/59c1340741ba863fb0d79287f66420e5dd782480/tests/scorer/test_model_graded.py)
cover invalid final grades, panels without a majority, grader failures and forged
field markers. These supply concrete malformed-input cases for the existing local
runners. Marking fields is not proof that a model ignores injected instructions.
The default can also use the model being evaluated if no separate grader is bound:
framework use alone does not establish evaluator independence. MIT repository
licence; upstream tests were read, not run.

### A concrete omission case

Source: “The preview is ready. Publish only after the client approves it.”

Shortened draft: “The preview is ready.”

The remaining sentence is supported, but a person using the draft no longer knows
the publishing condition. Ask two separate questions: is the preview ready, and what
must happen before publishing? Compare with a faithful alternative: “Preview ready;
client approval is required before publishing.” Assess which questions a requested
summary actually needs; do not make every source detail compulsory by default.

### Findings that change the saved plans

Support, coverage, preference and grader validity need distinct observations.
None of these ten source inspections establishes better writing in either project.
The most direct new candidates are cross-example preference validation, controlled
nearby cases, evidence-returning questions and explicit handling of invalid grades.
These can be tested through existing owners. No package adoption, model download,
training, installation or new framework is proposed by this catalogue.

For Simple, put controlled changes and grader failures into the existing
meaning-preservation/handoff evaluation path. Keep arbitrary lexical scores out of
the acceptance rule. Preference-learning implementations inform how corrections
might be overgeneralised; they do not make Simple a personal-memory system.

## Second repository investigation, 16 November 2026

This pass examined ten further repositories, bringing the two additional-repository
passes to twenty distinct projects. It targets remaining questions about evidence,
changed preferences, time, abstention, judging bias and optimisation. Selected source,
tests and documentation were read; this is not a complete audit of any repository.

Six commit identities came from GitHub's API. After API rate limiting, four came from
the repository page's current commit field; all fifteen files initially read through
those four repositories' main branches were fetched again at those commits and their
SHA-256 hashes matched. Citations below use those fixed identities. A wrong suggested
Trustcall organisation returned 404; the author repository is `hinthornw/trustcall`.
Guessed `tests/test_metrics.py` in AlpacaEval and `tests/test_extraction.py` in
Trustcall returned 404; that does not establish absence of tests elsewhere.

Parallel discovery response: `resp_20234857-0284-4b23-a79a-ec770eaf5d2e`.
Source inspection corrected several overbroad suggestions in its synthesis. A
knowledge-update score is not an erasure guarantee; generated claims checked against
voice examples are not necessarily checked against the current source; an archive
with readable annotations is not wholly inaccessible merely because its README
mentions approval.

### Factual evidence and abstention

**11. FActScore.** [The scorer](https://github.com/shmsw25/FActScore/blob/f28272deffcf33efc1f1117d5479c10bb75221a9/factscore/factscorer.py)
decomposes generated writing into individual facts, checks support against a chosen
knowledge source and retains each fact's decision. The result includes response rate
and facts per response, not only an average score. With its default `gamma=10`,
responses with fewer facts receive a numerical penalty; the unpenalised score is
reported separately. This is not a measure of whether a short requested reply is
good or whether every important source fact survived.

The useful transfer is inspectable claims with their evidence and separately
reported nonresponses. Use the actual supplied source for the draft's claims.
Approved voice examples show style; they do not establish new project facts or
promises. Inspect extracted claims against the original: decomposition can itself
lose conditions. MIT code; the tree exposed reproduction scripts rather than a
dedicated unit-test suite. No model, retrieval database or factuality pipeline was run.

**12. Amazon RefChecker.** [Extraction prompts](https://github.com/amazon-science/RefChecker/blob/1df1b25cee792ba2b171302e31ca4f768bd67703/refchecker/extractor/extractor_prompts.py)
ask for claim triples; the
[aggregators](https://github.com/amazon-science/RefChecker/blob/1df1b25cee792ba2b171302e31ca4f768bd67703/refchecker/aggregator.py)
distinguish entailment, neutral evidence, contradiction and abstention in different
ways. Neutral evidence is useful as its own state: insufficient support differs
from an established contradiction. A triple representation still needs testing for
negation, conditions and attributed claims.

A small offline probe ran only the inspected, dependency-free aggregator module.
It produced these exact results; the full checker and its callers were not run:

| Labels supplied to the aggregator | Strict result | Soft result |
| --- | --- | --- |
| Empty list | Abstain | Abstain 1.0 |
| Entailment | Entailment | Entailment 1.0 |
| Neutral | Neutral | Neutral 1.0 |
| Contradiction | Contradiction | Contradiction 1.0 |
| Abstain | Entailment | Abstain 1.0 |
| Entailment, Abstain | Entailment | Each 0.5 |

The strict function only changes its initial entailment result for neutral or
contradictory labels. This is a reproducible function-level boundary, not proof that
an upstream checker supplies those abstention inputs in a deployed path. Do not
copy the aggregation rule as a general acceptance test. Missing assessments must
remain visible.

The [README](https://github.com/amazon-science/RefChecker/blob/1df1b25cee792ba2b171302e31ca4f768bd67703/README.md) still says human annotations
will be released upon approval, but the pinned tree contains annotation JSON and a
[CC BY 4.0 data licence](https://github.com/amazon-science/RefChecker/blob/1df1b25cee792ba2b171302e31ca4f768bd67703/benchmark/human_annotations_v1/LICENSE.txt).
One [annotation file](https://github.com/amazon-science/RefChecker/blob/1df1b25cee792ba2b171302e31ca4f768bd67703/benchmark/human_annotations_v1/accurate_context/dolly_gpt4_answers.json)
was fetched and parsed successfully: 100 records, 136,021 bytes, SHA-256
`7c54cf1fb2ff5320a6b5cc9432fd2b2483bd6c467bc7a42f7e01ba83705a8985`.
This establishes access to that file, not the completeness or quality of all labels.
Apache-2.0 code; the repository was archived at inspection. No dedicated unit-test
suite was identified in its tree.

**13. LongMemEval.** The
[QA evaluator](https://github.com/xiaowu0162/LongMemEval/blob/9e0b455f4ef0e2ab8f2e582289761153549043fc/src/evaluation/evaluate_qa.py)
has separate prompts for ordinary recall, time, updated knowledge, preferences and
unanswerable questions. Useful case families include a previously true fact, a later
correction, an answer requiring several sessions and a question history cannot answer.
The [retrieval metrics](https://github.com/xiaowu0162/LongMemEval/blob/9e0b455f4ef0e2ab8f2e582289761153549043fc/src/retrieval/eval_utils.py)
also separate finding any relevant evidence from finding all of it.

Its benchmark rules need adaptation: time questions can tolerate off-by-one errors;
updated-knowledge answers may include older information; preference answers need not
satisfy every rubric item. These are benchmark-specific choices. They cannot establish
correct dates, clear current instructions or complete meaning in these tools.

The evaluator parses its grader with `'yes' in eval_response.lower()`. A local probe
of that expression accepted both “Yesterday, no.” and “not yes”. No model produced
those strings in this investigation; they are synthetic parser controls. The script
also skips prediction IDs absent from the reference set and iterates supplied
predictions, so completeness requires independent ID accounting. Borrow its case
families, not its substring parser or permissive completion assumptions.
MIT code; no dedicated unit-test suite was identified. The
[README](https://github.com/xiaowu0162/LongMemEval/blob/9e0b455f4ef0e2ab8f2e582289761153549043fc/README.md) points to cleaned benchmark data;
none of that dataset was downloaded here.

### Changed preferences, stored evidence and correction

**14. LangMem.** The
[memory managers](https://github.com/langchain-ai/langmem/blob/4beb9c36a40953f09357e5b2dd62ecc726f22d13/src/langmem/knowledge/extraction.py)
separate proposals to insert, update and remove memories. Public factory signatures
default to enabling updates and disabling deletion, while other internal paths have
different defaults. Inspect the actual selected entry point before asserting a
default for the whole library.

The synchronous store-manager path submits `store.put` and `store.delete` work,
does not inspect those futures' results, and returns proposed puts. Reading that path
supports a persistence-verification concern; no failing store was exercised here.
A returned proposed change is not independent confirmation of a durable write.

The visible [summarisation tests](https://github.com/langchain-ai/langmem/blob/4beb9c36a40953f09357e5b2dd62ecc726f22d13/tests/short_term/test_summarization.py)
cover a different boundary from preference replacement or durable deletion. Their
presence does not prove those operations. MIT code. Reuse the explicit distinction
between proposing and applying a change; do not add a second memory service or
delegate deletion authority to an inferred preference.

**15. Trustcall.** [The extractor](https://github.com/hinthornw/trustcall/blob/8c7312b591542cf9349ce00d2811e890ea6eef91/trustcall/_base.py)
requests changes as JSON patches rather than rewriting a whole existing object,
validates the result and permits bounded repair attempts. Insert, update and delete
are explicit options. The
[fake-model tests](https://github.com/hinthornw/trustcall/blob/8c7312b591542cf9349ce00d2811e890ea6eef91/tests/unit_tests/test_extraction.py)
exercise a valid patch, an invalid field type followed by repair, existing objects
and empty patches.

This is a useful way to test preservation of unrelated fields during a correction.
A schema-valid patch can still change the wrong person's preference or invent a
reason, and a retry is another model call rather than free correctness. Prefer
the existing deterministic replacement operation where the requested edit is
already explicit. MIT code. No extractor or model was run.

**16. Mem0.** [The update prompt](https://github.com/mem0ai/mem0/blob/f1791daa86d469249c9b002f62644d58a1eb96a0/mem0/configs/prompts.py)
asks a model to choose add, update, delete or no change. Those proposed actions are
not user authority. The inspected asynchronous delete in
[memory operations](https://github.com/mem0ai/mem0/blob/f1791daa86d469249c9b002f62644d58a1eb96a0/mem0/memory/main.py)
removes a vector record and records its previous text in deletion history through
[SQLite history storage](https://github.com/mem0ai/mem0/blob/f1791daa86d469249c9b002f62644d58a1eb96a0/mem0/memory/storage.py).
Deleting an active memory therefore differs from erasing all retained copies.

The [test file](https://github.com/mem0ai/mem0/blob/f1791daa86d469249c9b002f62644d58a1eb96a0/tests/test_memory.py)
includes both mocked client checks and more specific reset checks covering history
and message tables. A mock returning “deleted successfully” does not verify erasure.
The portable idea is to name which evidence stops influencing writing and which
original/history records remain, then verify the actual selected scope. Do not turn
replacement of an example into unrequested deletion of retained originals.
Apache-2.0 root code licence; only these Python paths were inspected.

### Optimisation and comparison quality

**17. GEPA.** The
[reflection proposer](https://github.com/gepa-ai/gepa/blob/ce5b0d6e3d6af6c6dbec6de2c54536bbb961d309/src/gepa/proposer/reflective_mutation/reflection_lm.py)
uses current instructions and task feedback to propose changes. The concrete lesson
is to attach an observed failure and source evidence to a proposed instruction,
rather than asking for a generally better prompt.

The [cache regression tests](https://github.com/gepa-ai/gepa/blob/ce5b0d6e3d6af6c6dbec6de2c54536bbb961d309/tests/test_valset_cache_split.py)
demonstrate why case identity must include its evaluation split: training case 0
must not fill validation case 0's result. They also preserve reuse when the two sets
actually are the same. Its
[cost tests](https://github.com/gepa-ai/gepa/blob/ce5b0d6e3d6af6c6dbec6de2c54536bbb961d309/tests/test_reflection_cost_tracking.py)
show a plain callable can have estimated token counts but zero recorded money cost.
Zero recorded cost is not evidence of free external work. Keep proposal, grading,
retry and validation calls within one recorded experiment budget.
MIT code; tests were read, not run. Optimisation remains deferred until the metric
and cases are trustworthy.

**18. DSPy.** [BootstrapFewShot](https://github.com/stanfordnlp/dspy/blob/2c07ebbee3a66f6e04b71e141c6c198f1b31a129/dspy/teleprompt/bootstrap.py)
can turn successful model traces into demonstrations. Success is determined by a
metric and optional numerical threshold; without a metric it defaults to success.
This is different from using human-approved writing examples.

The [tests](https://github.com/stanfordnlp/dspy/blob/2c07ebbee3a66f6e04b71e141c6c198f1b31a129/tests/teleprompt/test_bootstrap.py)
explicitly cover threshold zero and truthy/falsy metric values. Even Boolean false
is numerically zero and meets a zero threshold. Keep a required meaning verdict
separate from numerical preference or retrieval scores; never infer approval merely
because a candidate cleared an arbitrary threshold. Generated demonstrations remain
assistant output until actually approved. MIT code; no optimisation or model call
was run.

**19. FastChat / MT-Bench.** The
[pairwise judgment implementation](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/common.py)
asks the judge in both answer orders, maps positions back to model identities and
keeps both raw judgments. Its loader labels disagreeing winners `inconsistent`.
That is a materially different state from an agreed tie or an agreed rejection.

Use swapped-order disagreement as a reported observation rather than discarding
awkward cases or silently counting them as quality ties. Two judgments cost two
calls; order agreement still does not prove faithful meaning or independent judging.
Apache-2.0 root code licence. The pairwise source was read; judge-specific unit tests
and live judgments were not verified.

**20. AlpacaEval.** The
[pairwise annotator](https://github.com/tatsu-lab/alpaca_eval/blob/cd543a149df89434d8a54582c0151c0b945c3d20/src/alpaca_eval/annotators/pairwise_evaluator.py)
randomises answer order using reproducible input-based seeds; that does not mean
every pair is judged in both orders. The
[length-controlled metric](https://github.com/tatsu-lab/alpaca_eval/blob/cd543a149df89434d8a54582c0151c0b945c3d20/src/alpaca_eval/metrics/glm_winrate.py)
fits preferences with length-related features and reports raw and adjusted values.

The relevant experiment is a short/long matched pair with the same usable facts,
plus a longer answer whose extra detail is necessary. A small personal-writing test
set does not automatically justify a fitted length correction. Length control also
must not penalise the detail a user requested or hide a changed promise.
Apache-2.0 code; dataset rights require their own check. The guessed metrics-test
path was unavailable; neither a test suite nor the statistical model was run.

### Implications for the saved implementation plans

Add source-grounded cases for unknown answers, a changed fact with the earlier fact
still present, and an inferred preference contradicted by a later approved edit.
Keep factual support, source coverage, active influence, retained history and user
approval separate. A benchmark's relaxed answer rule is not a local requirement.

For evaluator mechanics, retain case IDs and source identities, require complete
assessments, reject malformed verdicts, preserve order disagreement and keep validation
cache entries separate from development entries. Test with synthetic inputs through
the existing runner. These findings refine existing plans; they do not introduce
a memory framework, an optimiser dependency or authority to train or install.

For Simple, the immediate value is better unknown-state and grader controls in the
existing handoff and preservation cases. Cross-session memory benchmarks supply
questions to test, not a new persistent state requirement.

## Ink and the third supplied post, 16 November 2026

The owner supplied [Erin Meryl McGurk's post](https://x.com/erinmerylstudy/status/2121917828735578122),
which links to [Ink](https://ink.ego.ist) and quotes
[Ben Dicken's writing-skill experiment](https://x.com/BenjDicken/status/2121735890934583784).
The post, quoted post and both attached screenshots were inspected. X's direct
fetch returned 403; Parallel recovered the text and a Treg lookup confirmed the
expanded product link and image URLs.

Ben reports trying pattern-removal instructions, iterative detector-scored editing,
a voice profile and existing skills, then suggests fine-tuning may be necessary.
That is an informal experiment report, not evidence that fine-tuning is the only
reliable route. Erin's screenshot shows one before/after detector demonstration;
the rewritten sample is labelled possibly human with a short-text qualification.
Neither screenshot measures preservation of a particular writer's voice, factual
correctness or a general detector success rate.

### What the product and published test establish

Ink's [product guide](https://ink.ego.ist/ai-humanizer) describes a specialised shared
rewriter, adjustable amount of editing, warnings for missing names/numbers/quotes/
citations/links, and a comparison view. It explicitly separates the shared model
from a trained personal voice. The
[review guide](https://ink.ego.ist/rewrite-without-losing-facts) distinguishes keeping
the draft's claims from checking those claims against underlying evidence.

The [fact-retention report](https://ink.ego.ist/facts-benchmark), dated 9 November,
uses a checker for numbers/dates, names and quoted spans. It covers 20 eligible
documents out of 33. A lexical change can flag a faithful paraphrase, while a
retained name can accompany a changed relationship. The report does not measure
unsupported additions or complete meaning. Comparator outputs were collected in
October; Ink's runs were in November. It gives overlapping uncertainty intervals
and lacks effective-settings/model-version attestation.

The [published counts CSV](https://ink.ego.ist/facts-benchmark/results.csv) reports
checked changes or omissions in 3/20 Light, 5/20 Balanced and 4/20 Strong outputs.
A local arithmetic check recomputed every rate and Wilson interval across its
14 rows; all matched. CSV SHA-256:
`3fc9a7b842e0d786c8f3aabd90f1d34a99b8d98739936e19b6440fbd387c66f7`.
That verifies count arithmetic, not the labels or live rewrites. The report separately
identifies unchanged outputs and retained source sections: preserving text is not
evidence that the requested editing was achieved.

### Source availability, integration and data boundaries

The linked [dataset snapshot](https://huggingface.co/datasets/ai-humanizer-benchmark/ai-humanizer-benchmark/tree/6306b2043736dd958cf39ee1d9a64956c54dd78a)
has a [README](https://huggingface.co/datasets/ai-humanizer-benchmark/ai-humanizer-benchmark/blob/6306b2043736dd958cf39ee1d9a64956c54dd78a/README.md)
and an associated [public data/scoring repository](https://github.com/AIHumanizerBenchmark/AIHumanizerBenchmark).
They describe fixed prompt selection, published inputs/outputs and frozen scoring.
The README identifies the UndetectedGPT team as the benchmark operator. Open records
make recomputation possible; they do not independently validate detector judgments.
This benchmark's score combines detector results, embedding similarity and model-rated
readability, which differs from our requested writing outcomes. Code is described as
MIT and cycle data as CC BY 4.0. Its full verification command was not run here.

The [agent reference](https://ink.ego.ist/agents) distinguishes finished output from
pending blocks and finished output requiring review. A `needs_review` result can
have an empty warnings list. This is a useful example of why “no warnings” cannot
stand in for approval. Its direct mode bypasses rewrite processing and ignores
rewrite settings, so direct and ordinary rewriting cannot be assumed equivalent.
These are documented contracts, not exercised integration results.

The [privacy page](https://ink.ego.ist/privacy) and [terms](https://ink.ego.ist/terms)
separate ordinary rewrites, free tries, feedback and voice training. Free-try text
and outputs may train the shared model and are retained for 60 days; feedback has
separate training use and retention. Voice training requires separate consent.
Removing a sample does not undo an already trained adapter. Some modes send text
to OpenAI. No writing was submitted, account connected, trial started or model run.

No public Ink model card, checkpoint, training recipe or source repository was
identified on the inspected pages. This is an inspection limit, not proof that none
exists. The publicly linked benchmark repository is not Ink's model implementation.

### Useful experiments for the two existing plans

Keep protected details as a separate, inspectable review aid alongside source meaning
questions. Include a faithful paraphrase that changes surface wording, a rewrite
that keeps every name and number but swaps responsibility, and a new unsupported
claim whose protected details all survive. Compare an unchanged answer with an
actually improved one so simple retention cannot win by doing no editing.

Separate generic natural wording from an individual's voice, a warning from an
acceptance verdict, and a training consent from approval to use an example. Test
amounts of editing against the requested task without adding compulsory product
modes. The screenshot and published counts do not justify detector optimisation,
training or a new dependency in either repository.

## Models behind the tools in Ink's benchmark, 16 November 2026

The owner requested research on every listed service and asked whether its models
are open source. All eleven non-Ink products are covered below; Ink is covered in
the preceding section. These are product names, not eleven identified base models.
A hosted API, a model selector, an SDK and downloadable model weights are different
forms of access.

No vendor-linked release of the rewriting model's source and weights with a reuse
licence was identified in this inspection, including for Ink. This does not prove
that no release exists or that every hidden base model is closed. “Our model”,
“trained on human writing” and a hosting-provider name do not establish a base
checkpoint, training recipe, licence or right to run it locally. SuperHumanizer
discloses a Gemini-based secondary model, but not a precise checkpoint.

### Product identities, model disclosures and access

| Product and primary source | What is actually disclosed | Documented access and remaining unknowns |
| --- | --- | --- |
| [AIHumanize](https://aihumanize.io/) | The [API](https://aihumanize.io/api) uses selectors 0, 1 and 2 for quality, balance and enhanced rewriting. | REST rewriting is documented. Base checkpoint, training recipe and reusable weights were not identified. This is aihumanize.io, not the similarly named aihumanize.com. |
| [Clever AI Humanizer](https://cleverhumanizer.ai/) | Its site claims training on human text; its [privacy policy](https://cleverhumanizer.ai/privacy) discloses external LLM API processing. Neither identifies the base model. | The [developer page](https://cleverhumanizer.ai/api) offers embeddable widgets and describes a general REST API as coming soon with a waitlist. An internal widget API is not a verified public developer contract. No model release identified. |
| [GPTinf](https://www.gptinf.com/about-us) | Describes its rewriting system and writing tools without an identifiable underlying checkpoint. Marketing about algorithms does not supply a reproducible method. | Web rewriting is documented. No general developer API or model release was located in inspected official material; do not infer absence from that search limit. |
| [HIX Bypass](https://hixbypass.com/about) | Describes a language-model-based rewriter; branded modes and engine versions do not identify the base model. | [V2 API documentation](https://hixbypass.com/api-docs) and [older API documentation](https://bypass.hix.ai/api-docs) expose submit/result/usage workflows. The older product domain redirects to hixbypass.com. No model release identified. |
| [ReHumanize](https://rehumanize.io/) | The UI names Base and Pro, with length, tone, purpose and style controls. No precise model or training recipe is disclosed in inspected material. | Web tool observed; no separately verified public API or model release. This is not the unrelated rehumanize.co.uk browser-extension product. |
| [SmartHumanizer](https://smarthumanizer.ai/) | Describes adjustable rewriting and shows Standard/Advanced controls. Input-provider logos are not evidence that any one provider powers the rewriter. | Web tool observed; no separately verified developer API or model release. Do not conflate smarthumanizer.ai with similarly named domains. |
| [StealthGPT](https://docs.stealthgpt.ai/api-reference/models) | Service models Super, Standard and Lite. The [data-flow reference](https://docs.stealthgpt.ai/api-reference/data-handling) names hosted inference and supporting providers; those are not base-checkpoint identities. | REST, async and MCP interfaces are documented. No reusable rewriting weights or exact base checkpoints identified. |
| [SuperHumanizer](https://superhumanizer.ai/how-it-works) | Describes fine-tuned main models and a secondary Gemini-based model. Super Lite, Super Ultra and Premium alter processing; Azure hosting does not identify the primary model. | A [humanizer API](https://superhumanizer.ai/ai-humanizer-api) is documented. No exact base checkpoint, full training recipe or model release identified. |
| [Undetectable AI](https://undetectable.ai/develop) | The [Humanizer Proxy reference](https://help.undetectable.ai/en/article/humanizer-proxy-1vmpd9d/) names stealth and undetectable model options. | Hosted APIs are documented. Those option names do not identify downloadable checkpoints or licences; no model release identified. |
| [UndetectedGPT](https://www.undetectedgpt.ai/ghost) | Ghost-2/Ghost-1 are branded humanisation versions. Its product model card and API do not disclose a reusable base checkpoint. | [REST model selection](https://www.undetectedgpt.ai/dev/docs/api-reference) is documented. A page called a model card is not itself an open-weight release. No model release identified. |
| [WriteHuman](https://writehuman.ai/api/docs) | Describes its own models and supporting providers. Public requests accept text, tone and language; an explicit model parameter is rejected. | REST and installable TypeScript/Python SDKs are documented. Client libraries call the hosted service; they do not contain its rewriting weights. No model release identified. |

The fixed [October dataset](https://huggingface.co/datasets/ai-humanizer-benchmark/ai-humanizer-benchmark/tree/6306b2043736dd958cf39ee1d9a64956c54dd78a)
was downloaded and parsed: 363 October rows, 33 for each of eleven tool identities.
Its `source_model` field identifies the model that wrote the original input, not
the humanizer's underlying model. The complete downloaded flat file has 726 rows
across two cycles. No rewriting inference was performed.

### Content handling differs by service and entry point

These are vendor policy statements, not independently observed deletion or training
behaviour. Some extracts came from cached September–November 2026 snapshots; policy
and API availability must be refreshed before connecting an account or sending text.

| Product | Primary policy or operational source | What it supports and leaves unknown |
| --- | --- | --- |
| AIHumanize | [Privacy](https://aihumanize.io/privacy) | The inspected policy is dated 2023 and gives generic retention language. Submitted-text training, a precise retention period and free/paid/API differences were not established. |
| Clever | [Privacy](https://cleverhumanizer.ai/privacy) | Explicitly excludes content training by itself and providers, but permits debugging, staff sample review and automated evaluation. Ordinary text/output is deleted after 30 days or earlier account/history deletion, subject to exceptions. No training does not mean no retention or human access. |
| GPTinf | [Content-handling guide](https://help.gptinf.com/hc/en-us/articles/46663298509585-How-GPTinf-handles-your-content-privacy-overview) and [policy](https://www.gptinf.com/privacy_policy) | Says content is not used for model training. Anonymous runs are not retained beyond the session; paid saved history is retained. Its detector sends text to multiple detector services, while grammar uses self-hosted LanguageTool. Self-hosted grammar says nothing about self-hostable humanization. |
| HIX Bypass | [Privacy](https://hixbypass.com/privacy-policy) | General collection/sharing language does not establish a precise humanizer-text retention period or training exclusion, especially for API versus website use. Those details remain unknown here. |
| ReHumanize | [Homepage](https://rehumanize.io/) and [privacy](https://rehumanize.io/privacy-policy) | Marketing claims delete-on-use; the formal policy gives general necessary-retention language. It does not establish a precise training-use or per-entry-point guarantee. The guessed /privacy route failed; /privacy-policy was readable. |
| SmartHumanizer | [Privacy](https://smarthumanizer.ai/privacy) | Gives general necessary retention and infrastructure/security processing. No explicit humanizer-text training rule or free/paid difference was established. |
| StealthGPT | [API data handling](https://docs.stealthgpt.ai/api-reference/data-handling) | API history records source, output and usage/model metadata; several hosted services can process content. Do not call it local or zero-retention because it has an API. Web and API workflows differ. |
| SuperHumanizer | [Privacy](https://superhumanizer.ai/privacy) | Says source text is not retained on its own servers beyond processing, but text goes to external generation and detection providers. Browser history and provider processing remain distinct. |
| Undetectable AI | [Privacy](https://undetectable.ai/privacy) | The inspected page is dated 2023 and gives generic necessary retention. A specific submitted-text training exclusion, fixed erasure time and entry-point differences were not established. |
| UndetectedGPT | [Privacy](https://www.undetectedgpt.ai/legal/privacy-policy) | General retention and AI-infrastructure processing are disclosed. A precise humanizer-text training exclusion, retention duration or API exception was not established. |
| WriteHuman | [Privacy](https://writehuman.ai/privacy) | Website/app content and feedback may train/evaluate models. Developer API/MCP excludes database storage and training, but explicitly allows temporary request data in service logs during limited testing. This is not an unconditional no-retention promise. |

No samples from either local repository's personal store were submitted. No product
was installed, account created, subscription purchased or remote rewriting job run.

### What can be learned without adopting a service

StealthGPT's [preservation controls](https://docs.stealthgpt.ai/api-reference/text-preservation)
document holding marker strings fixed and restoring protected text in the caller.
Text between two markers is still editable; preserving a whole passage requires
replacing that passage with one marker. A preserved citation marker can still be
attached to an altered claim. Test marker identity/order and meaning separately;
a correct marker count is not enough.

SuperHumanizer's [method description](https://superhumanizer.ai/how-it-works) separates
paragraph rewriting, validation, further candidates, a second model and retaining
source text when candidates fail. Its Proofread and sentence alternatives are
interesting review patterns. This is a vendor-described process, not a reproduced
quality result. Paragraph-level checks need a distant-exception case; kept source
must not be reported as a successful requested rewrite.

StealthGPT also publishes a
[benchmark repository](https://github.com/StealthGPT-Labs/humanizer-benchmark).
It withholds humanized output and internal quality-test logic while exposing other
records. That is a benchmark release, not a model release, and restricts independent
output-level audit. The separate
[AI Humanizer Benchmark repository](https://github.com/AIHumanizerBenchmark/AIHumanizerBenchmark)
publishes more cycle material but its operator also builds UndetectedGPT.
Neither publication establishes an individual's voice or a neutral purchasing rank.

The narrow transferable ideas are protected source passages with an independent
meaning check, editable comparisons, explicit kept-source/nonresponse reporting and
an exact identity for each tested service/mode. Keep generic tone, detector results,
personal voice and factual preservation separate. The evidence does not warrant
swapping Simple or Communicator to one of these services or starting fine-tuning.

Discovery response: `resp_9c508461-8910-4a6b-a53e-1330b182e0af`. Its “no API found”
summary for Clever was refined by the official widget/API page; its API shortlist
was not adopted as a recommendation. No official source/model release located is
the supported conclusion, rather than a claim that none could exist.

## Brian Bell's codehygiene, 16 November 2026

The owner's “brainbell codehygeiene” reference resolves to
[brianbell-x/codehygiene](https://github.com/brianbell-x/codehygiene), inspected at
`423c7e1f02ef409bbaea209268bfcde36e0f1cb0`. This is a code-style scorer, not a
language model that writes or rewrites prose. It is a concrete example of a small
local checking tool used alongside the writer LLM.

The [package metadata](https://github.com/brianbell-x/codehygiene/blob/423c7e1f02ef409bbaea209268bfcde36e0f1cb0/pyproject.toml) declares version 0.4.0, MIT licensing,
Python 3.10+ and NumPy. The tree contains source and weights but no standalone
LICENSE file was found; resolve the complete notice before redistributing copied
material. The released archive was fetched: 13,281 bytes, SHA-256
`85a3d926cd71f0f6024b0ee1e0cb5223980c046203bf8fbcf68a6598ee9c0e0d`.
Availability of these weights differs from the hosted humanizers investigated above.

### Mechanism and local checks

[compile.py](https://github.com/brianbell-x/codehygiene/blob/423c7e1f02ef409bbaea209268bfcde36e0f1cb0/compile.py) constructs hand-designed pattern circuits as ternary
matrices and channel scales. This is not gradient training on the owner's writing.
The [runtime](https://github.com/brianbell-x/codehygiene/blob/423c7e1f02ef409bbaea209268bfcde36e0f1cb0/codehygiene/__init__.py) encodes source into a byte grid, runs
convolutions/attention and returns scores and line warnings. Its rule-like structure
can execute locally without a remote judge.

A disposable probe used NumPy through an isolated uv environment; no skill was
installed or repository dependency changed. Released weights produced:

- A deeply nested control warned on lines 6 and 7, with score approximately 0.116.
- A short valid function scored 0.893 with no warnings; a similar function referencing
  an undefined name scored 0.899 with no warnings. Correctness is outside that result.
- Changes after column 128 gave identical encoded input and score. Source after the
  default 2,048-line cap was also invisible to the encoded grid.
- `café = 1` and `cafö = 1` encoded identically because non-ASCII code points are
  collapsed. This is a representation limit, not a test of multilingual readability.

The compiler was also run to a disposable output. All 53 parameter names matched.
Two arrays differed by at most 2.384185791015625e-7 and passed NumPy's default
allclose comparison; the other arrays were identical. The two short sample scores
were unchanged. This is approximate numerical reproduction, not byte identity or
a reproduction of the published benchmark.

### What its evidence does and does not show

The [agent corpus report](https://github.com/brianbell-x/codehygiene/blob/423c7e1f02ef409bbaea209268bfcde36e0f1cb0/corpus/README.md) describes four generated subsystems,
a baseline followed by a skill-guided refactor, and passing scenario tests. Its
headline improvement is the same hygiene metric used to guide the edits.
An extra refactoring pass without the gate, held-out human comprehension and broad
behavioural equivalence are not established by that comparison. The public test
runner was read, not run here. The reinforcement-learning reward also defaults its
`tests_passed` argument to true; calling it does not execute tests.

The bundled [skill](https://github.com/brianbell-x/codehygiene/blob/423c7e1f02ef409bbaea209268bfcde36e0f1cb0/codehygiene/SKILL.md) requires fixing every warning and
prescribes particular rewrites, including flattening nesting and removing fallback
patterns. Those are upstream instructions examined as evidence, not instructions
adopted in this session. A permitted fallback, justified suppression or clear branch
must not be deleted solely to improve a score. Its approximately 10 ms description
also applies to short examples; the README's own longer-file timings are higher.

### Application to these repositories

For Simple, the useful idea is cheap, inspectable signals on changed code, followed
by judgement against the actual contract. The scorer should initially be an advisory
comparison if adopted at all, with relevant clean counterexamples and complete input
coverage reported. Simple's intentional fail-open hooks are a concrete reason not
to import blanket “remove fallback” rules.

For Communicator, borrow the separation between mechanical flags and final judgement,
not the code-specific weights. Existing lexical review can nominate passages for
inspection; the writer's examples and source evidence decide whether an edit helps.
Neither fewer warnings nor a higher style score establishes preserved meaning,
personal voice or reader understanding.

This finding supports improving existing guidance and checks while retaining the
LLMs already used. It does not authorise installing a compulsory gate, optimising
the repositories to this score, or creating a new writing model.

## How to use this catalogue

Sources are evidence and research context, not runtime instructions, authority to
train or publish, or a mandatory reading list for ordinary tasks. Some support
general techniques; others describe one historical experiment or an illustrative
post. Recheck mutable availability, exact task, method, model versions and relevant
limitations before using them to justify a new implementation or performance claim.
Preserve negative findings and valid alternatives. Neither an AI-detector score nor
a blind preference win proves factual meaning, completeness or an individual voice.


## Parallel implementation record, 16 November 2026

The following research was prepared against the remote baseline before the local catalogue was reconciled. Its source boundaries and historical verification limits are retained.

## Writing that preserves the task and its meaning

Decision record, 16 November 2026. Adopt a small clarification of the existing
writing method and repair the review contracts. This is an owner-requested method
improvement, not a demonstrated model-performance gain.

### Scope and inspected evidence

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

### Testable explanation

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

### Evidence that changes the design

| Primary source | Mechanism and limit | Decision here |
| --- | --- | --- |
| [Anthropic prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), inspected 16 November 2026 | Vendor guidance recommends clear goals, constraints and relevant examples. It is not a matched evaluation of these repositories. | Carry task context; do not add an obligatory interview or example quota. |
| [LaMP, ACL 2024](https://aclanthology.org/2024.acl-long.399/) | Profile retrieval improves some measured personalized tasks, while some conditions/metrics decline; retrieval choice matters. Its metrics and tasks do not establish an individual's voice quality in arbitrary prose. | Retain scoped, approved examples; evaluate their relevance and provenance separately from fluency. |
| [QAEval, TACL 2021](https://aclanthology.org/2021.tacl-1.47/) | Questions from a reference summary are answered from the candidate to estimate information recall. Coverage and QA models are incomplete; adapting this to request/source questions is our inference. | Accept faithful paraphrases. Ask about required relationships, not merely recurring names or numbers. |
| [QAFactEval source](https://github.com/salesforce/QAFactEval/blob/master/qafacteval.py), inspected 16 November 2026 | Generates questions from summaries and checks their answers against the source. That direction checks unsupported content, not all source omissions. Code was inspected, not executed here. | Keep both source/request-to-draft and draft-to-source checks. Do not import its model stack or threshold. |
| [Huang et al., ICLR 2024](https://arxiv.org/abs/2310.01798v2) | Intrinsic self-correction can fail or degrade studied reasoning outputs. Revision prompts can confound comparisons by adding requirements missing from the initial prompt. | Stop when no concrete failure is found; use the same information in the one-pass control. |
| [ProCo, EMNLP 2024](https://aclanthology.org/2024.emnlp-main.714/) | Verification against a known masked condition improves studied reasoning tasks. Short problems with entity/number answers are not open-ended prose. | Known-condition checks are a testable lead, not proof that iterative rewriting works here. |
| [Lost in the Middle, v3](https://arxiv.org/abs/2307.03172v3) | Relevant information's position affects studied long-context tasks. This is not a direct test of skill activation or editorial adherence. | Record delivery/read evidence separately from use and task outcome. |
| [Style-personalization evaluation, v4, 1 September 2026](https://arxiv.org/html/2508.06374v4) | Content preference, style preference and copy-editing usefulness are distinct. Annotators are not the original authors; neither/both/indeterminate judgments and uncertainty matter. Binary discrimination does not fully capture the first-person perspective. | Keep voice, fidelity, usefulness and reader understanding separate. Do not introduce an ensemble or embedding threshold. |
| [MT-Bench / Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685v4) and [FastChat judging code](https://raw.githubusercontent.com/lm-sys/FastChat/main/fastchat/llm_judge/common.py), inspected 16 November 2026 | Judges exhibit position, verbosity and other biases. The code evaluates both orders and records mapped judgments. It was not executed here. | Anonymous candidates, ties/rejection and recorded order disagreements belong in evaluation; agreement is still fallible. |

Additional primary evidence retained from the parallel source inspection:

| Source | Decision and limit |
| --- | --- |
| [Relevant in-context examples, Liu et al. 2022](https://aclanthology.org/2022.deelio-1.10/) | Relevant demonstrations helped the studied tasks; this does not establish arbitrary personal voice or justify another retrieval service. |
| [QAFactEval paper, Fabbri et al. 2022](https://aclanthology.org/2022.naacl-main.187.pdf) | Summary-derived questions test consistency with a source. This is distinct from QAEval’s reference-to-candidate coverage direction and from independently verifying source truth. |
| [Self-Refine, Madaan et al. 2023](https://proceedings.neurips.cc/paper_files/paper/2023/file/91edff07232fb1b55a505a9e9f6c0ff3-Paper-Conference.pdf) | Specific feedback and revision helped several studied tasks. Combined with the self-correction counterevidence above, this supports targeted repair rather than a universal polishing loop. |
| [Claude personalization](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features), [Grammarly Goals](https://support.grammarly.com/hc/en-us/articles/360054679292-What-are-Goals) | Vendor scopes separate general instructions, projects, skills and task goals. Grammarly documents intent that does not affect suggestions: collecting a field is not evidence that the path uses it. No independent quality gain follows. |

Two writing products supply implementation precedents, not independent performance
evidence. [Grammarly's Paraphraser](https://support.grammarly.com/hc/en-us/articles/38552469933837-Paraphraser-agent-user-guide)
accepts writing samples for a selectable custom voice and lets the user accept,
dismiss or undo suggestions. [QuillBot's modes](https://help.quillbot.com/hc/en-us/articles/35854318883351-What-are-modes-in-the-Quillbot-Paraphraser-and-how-do-I-use-them)
make the rewrite objective explicit; its Creative mode acknowledges possible meaning
changes. Neither page demonstrates fidelity or personal-voice gains for this change.
No writing was submitted to either product.

### What belongs in each repository

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

### Separate the claims being checked

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

### Verification and spending boundary

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

### Same-day reconciliation and follow-up

A final remote check discovered [draft PR 2](https://github.com/timc0y/simple/pull/2)
at `5032a8688a51ff5c3af73bee67ea836db5274ccd`, created while this separate checkout
was being verified. Its 52 changed files were fetched and checked against their Git
blob hashes. The follow-up preserves that draft, its CI dependency fix, eight-case
suite, revised operation-aware rubric, corrected retry reference, research sources
and recorded evidence. It retains the incoming conditional writing defaults and
consolidates the alternative development fixtures into the same suite. No unseen
local changes are claimed as preserved.

The evaluator follow-up adds exact normalized-result mapping and strict retained
order-check validation while keeping incoming frozen JSON source evidence, nested
artifacts and solver read-denial construction. Independent review found that a
truthy or malformed stable marker could manufacture a completed result; the final
path recomputes agreement from the actual strict verdicts before writing results.
These deterministic repairs do not establish semantic grader reliability.

The [follow-up record](../evals/results/2026-11-16-writing-check/README.md) owns its
checks and separate synthetic task. Its task ran against the recorded earlier
candidate bytes, before reconciliation; it is not a final-installed-skill claim.
The parent draft’s reported checks and native tasks remain attributed to that record,
not relabelled as executions by this lead. Both records prohibit paid API evaluation;
no extra model tasks were launched after reconciliation.
