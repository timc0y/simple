# A trustworthy `SIMPLE.md`

Research date: 28 August 2026.

## Decision

Treat `SIMPLE.md` as a short, current decision brief. Do not use it as a generated repository summary, policy database, or decision log.

Its quality needs four controls:

1. Build each material claim from repository evidence, an owner commitment, or a stated unknown.
2. Ask the repository owner to correct the text before you remove the incomplete marker.
3. Update the profile in the same change that alters one of its claims.
4. Keep `simple check` limited to facts that a program can establish.

Do not add more template prompts now. Improve the evidence-first interview and the profile review in the existing `init` and `review` workflows.

Do a test of this workflow before any runtime change.

## The evidence model

A trustworthy profile identifies the basis of each claim that can change a decision:

- **Observed:** The repository, history, command output, or production evidence directly shows the claim.
- **Committed:** A named owner confirms a promise, consumer, duty, or data obligation that the repository cannot show.
- **Inferred:** Evidence supports a conclusion but does not establish it. Keep the inference explicit.
- **Unknown:** A material fact has no confirmed answer. Keep the unknown visible until someone resolves it.

The W3C provenance model connects information to its source activity and responsible agent. Simple does not need RDF or a citation on every obvious statement.

Give a compact source or confirmation for a claim that is not obvious, stable, or repository-owned. See [W3C PROV-O](https://www.w3.org/TR/prov-o/).

NASA tells teams to identify stakeholders, collect expectations, validate traceability, get commitment, and manage changes. It also tells teams to check requirement sources and owners for current status.

Thus, the agent must inspect the repository before it asks questions. Ask the owner only for external facts that code cannot show.

See the [NASA Systems Engineering Handbook, sections 4.1 and 6.2](https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf).

## The owner interview

Make the interview a review of evidence, not a blank questionnaire:

1. Show each repository fact and its source.
2. Show only unknowns that could change ownership, preservation, compatibility, or proof.
3. Ask about actual users, operators, promises, consumers, retained data, and failure effects.
4. Ask neutral questions about current or recent events. Do not ask the owner to predict a possible future.
5. Draft the profile and point out each contradiction or unsupported obligation.
6. Ask the owner to accept or correct the result.

GOV.UK recommends open and neutral interview questions. It also recommends real examples instead of general statements about what should happen.

See the [GOV.UK interview guide](https://www.gov.uk/service-manual/user-research/using-in-depth-interviews).

## Freshness

Freshness depends on facts, not age. A profile becomes stale when reality changes.

Update the profile when a change affects one of these items:

- Users, operators, public consumers, or commitments change.
- Exported commands, packages, URLs, schemas, files, or host routes change.
- Persistent data, migrations, recovery duties, or failure effects change.
- An ordinary-path owner, mechanism, or observable behavior changes.
- A proof command, continuous integration route, or validator changes.
- Evidence satisfies a `Reconsider when` condition.

Google recommends an update to documentation in the same code change. This method gives the documentation and code the same review.

See [Google documentation best practices](https://google.github.io/styleguide/docguide/best_practices.html).

Anthropic recommends regular removal of old project instructions and rules that conflict. Use a periodic review only as a backstop.

A release, an agent error, or a changed claim is a stronger trigger. See [Claude Code project memory](https://code.claude.com/docs/en/memory).

Do not add an arbitrary expiry. An old profile can be correct, and a new review date does not prove correctness.

Git history already records the file changes. A semantic review must show what the reviewer checked.

## Size and scope

Agent instructions provide context. They are not hard configuration.

Anthropic recommends concise and specific instructions. It warns that the model can choose between rules that conflict without a reliable order.

GitHub recommends a small first instruction set. It also recommends changes based on results from real pull requests.

See [Claude Code project memory](https://code.claude.com/docs/en/memory) and [GitHub custom-instruction guidance](https://docs.github.com/en/copilot/tutorials/customize-code-review).

OpenAI found that one large `AGENTS.md` file became stale and difficult to verify. Its repository uses a short map and deeper owned documents.

See [OpenAI harness engineering](https://openai.com/index/harness-engineering/).

The *Lost in the Middle* study did not do a test of code-agent instructions. It did show unreliable use of facts at some positions in long contexts.

Thus, keep the profile focused and do a test of its effect. Do not select a universal word limit from this study.

See [Liu et al.](https://arxiv.org/abs/2307.03172).

Keep historical reasons for a large decision in the document that owns that decision. Link that document when the current profile needs it.

An architecture decision record can keep context, reasons, consequences, status, and replacement history. `SIMPLE.md` must not become that history log.

See [Microsoft architecture decision record guidance](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record).

## Nested profiles

Codex loads scoped instruction files from the repository root toward the work directory. More specific guidance can then take precedence.

See [OpenAI `AGENTS.md` guidance](https://developers.openai.com/codex/guides/agents-md).

Simple does not currently layer profiles. Its hook injects only the nearest `SIMPLE.md`.

A nested profile with only local differences would hide repository-wide facts. Until Simple supports inheritance, each nested profile must contain all applicable facts.

Repeated root facts can become stale in nested profiles. Do a dedicated evaluation before Simple recommends nested profiles for wide use.

The current sections can also cause repetition. A promise can appear in `Reality`, `Preserve`, `Current boundary`, and `Reconsider when`.

Each section must add a different decision consequence. It must not repeat the same sentence. Do a test of this rule before you add it.

## Two review gates

Keep two honest gates:

```text
simple check             -> files, headings, markers, placeholders, size, routing
simple review SIMPLE.md  -> truth, sources, contradictions, logic, freshness
```

The first gate can also find broken local links. It must not claim that a natural-language statement is true.

The second gate must inspect the repository. It must ask for owner authority when a material fact is not available.

A profile review must reject or correct these faults:

- A material claim has no evidence, owner, or explicit uncertainty.
- A possible future user appears as a current consumer or promise.
- The repository or a narrower profile contradicts a fact.
- An ordinary path omits its owner, mechanism, or observable behavior.
- A proof item is vague, obsolete, not runnable, or grades itself.
- A reconsideration condition cannot be observed.
- The profile copies generic method guidance from the skill.

Natural-language instructions cannot enforce a hard boundary. Put executable enforcement in the tool, hook, or continuous integration system that owns it.

## Current repository assessment

The present design is mostly sound. The template marks itself incomplete, and `init` tells the agent to inspect before the interview.

The profile guide keeps repository facts separate from generic principles. The `check` command says that it checks structure, not truth.

The evaluation index also separates a valid run from statistical proof.

The repository results show where work has value:

- A concrete owner and mechanism improved strict execution results from 4 of 12 to 12 of 12. See the [repository-fact comparison](../evals/results/2026-08-27-repository-fact-profile/README.md).
- Focused author guidance improved profile results from 2 of 6 to 5 of 6. See the [profile-reference comparison](../evals/results/2026-08-27-profile-reference-guidance/README.md).
- Two more template words tied at 1 of 6. Simple correctly rejected that change. See the [template-wording comparison](../evals/results/2026-08-27-profile-template-wording/README.md).

Before this change, the root `SIMPLE.md` showed these risks:

- “Other people may install” describes a possibility, not observed use.
- “Ponytail 4.9.0 proves that this pattern works” uses an external version as proof of Simple's current boundary.
- “Bundled validators” and “inspect ... together” do not give exact proof commands.
- The hook and host claims do not show their evidence or invalidation path.

The implementation removes these claims. It does not add more template fields.

## Evaluation result

The confirmation compared the current workflow with one candidate. The candidate adds
an evidence-first interview and a specific profile review.

The held-out cases cover these faults:

- A stale profile conflicts with the repository.
- Only the owner can establish an external promise.
- A change moves an ordinary-path owner and must also update `SIMPLE.md`.
- An agent invents a plausible consumer or compatibility duty.
- A profile gives vague proof instead of exact proof.
- A long profile repeats facts that a short profile states once.

Luna and Terra completed each case three times for both conditions. Two anonymous
graders accepted their pass reference and rejected their fail reference before they
graded answers. The candidate improved strict passes from 5 of 24 to 9 of 24. It did
not regress any case.

See the [profile-quality confirmation](../evals/results/2026-08-28-profile-quality-confirmation/README.md).

The confirmation did not test nested-profile inheritance. Test that behavior before
Simple adds a merge rule. The current hook still injects only the nearest profile.
