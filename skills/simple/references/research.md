# Decision research

Use research to resolve a question that can change what to build, reuse, keep or remove.
A narrow lookup can be enough. Do not turn a known local edit into a research project.

## Establish the question

1. Name the uncertainty and the decision it could change.
2. Read the repository facts that affect the answer.
3. Check existing code, installed tools, tests and recorded evidence.
4. Choose the next investigation by what could make the remaining work unnecessary.

## Learn from working systems

Use evidence suited to the question:

- Official documentation and clients.
- Software development kit (SDK) source and package implementations.
- Reference apps and tests.
- Issues and merged fixes.

Use available search or source tools. Do not depend on a particular search provider.
Check external claims that can change against current sources.
Keep private repository data out of public searches.

Trace the relevant inputs, operation order, state, output and failure behaviour.
Separate documented contracts, observed implementation details and inference.
An official client shows how its authors use the system.
Check whether each relevant behaviour suits this project and its supported access.
Reuse proven knowledge without extra architecture or access rights.

For pages and components, identify the reference app and the decisions it informs.
Record the source file or commit URL in the existing documentation or beside the code.
Explain what you reused and changed. Distinguish inspiration from copied code.
Obey licences and keep necessary attribution. Do not invent provenance.

## Resolve the uncertainty

For a question on why a design exists, distinguish current behaviour from past intent.
Trace the relevant code and the smallest useful commit, issue or decision trail.
State what the record establishes, what you infer and what remains unknown.
Code alone does not prove its author's reason.
Check whether an upstream fix resolves the problem before you write another implementation.

This distinction draws on [PStack's why workflow](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/why/SKILL.md).
Use its investigative questions when they change the decision, without requiring a
multi-source investigation for an ordinary lookup.

For a failure, compare one working and one failing case at the same boundary.
List plausible explanations only as far as needed to choose the cheapest observation
that separates them. Change one relevant factor at a time; another search is useful
only if its answer can alter the next action.

If the source cannot settle a consequential question, use the smallest reversible experiment through the real operation.
Prefer a result you can check over more explanation.
A reference implementation can supply comparison evidence.
Check intentional differences against this project's contract.
Do not copy bugs to match the reference.
Keep structured identity and relevant failure information in the experiment.

Keep product and external systems read-only unless the task authorises more.
Use a disposable local probe when safe and within scope.
Research does not itself authorise live mutations, spend, publication or a migration.

If evidence supports the next action and more research is unlikely to change it, stop.
If the necessary source or experiment is unavailable, state the unknown.
Do not replace absent evidence with confidence. Report the scope actually inspected;
a file inventory or sampled session review is not an exhaustive semantic audit.
Do not search for packages to replace trivial code without a concrete reason.

## Recommend and keep useful evidence

State the question, evidence, sources, recommendation and material unknowns.
Explain what work remains to own, including integration, operation and updates.
An existing package, application or command that completes the job is a valid outcome.

No new report is necessary.
Return the evidence in the conversation unless the user requests a durable record or the change needs one.
For a durable record, update the existing knowledge owner with the proven approach and recheck condition.
Keep temporary investigation output disposable.

For a broad historical investigation, record which relevant sources were inspected and which were unavailable.
A search with no result does not prove the event never happened.
Resolve conflicts by source proximity, direct evidence and applicability, not the number of matching accounts.
Keep consequential competing explanations until an observation distinguishes them.
Use `learning.md` for session-history recovery or adoption of working conventions.
