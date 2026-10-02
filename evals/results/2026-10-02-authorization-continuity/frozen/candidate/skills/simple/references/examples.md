# Worked examples and engineering precedents

Use a worked example to make a decision rule concrete. Change one material fact and
show when the recommendation changes. The worked cases below are synthetic.
The final section gives public engineering precedents and their sources.
Repository evidence still decides the real case.

## A deleted caller can leave a live contract

A job handler has no source callers, but queued jobs still contain its old type name.
Keep a supported handler until those jobs finish or migrate them through the queue's
supported operation. If no jobs, external callers or compatibility promises remain,
delete the handler. The queue state changes the answer, not the source reference count.
This illustrates [PStack's blast-radius check](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/blast-radius/SKILL.md).

## A shorter path can still need a guard

An in-memory filter repeats the same validation with no effects between checks.
Remove the duplicate check at its shared owner. If a payment request can time out
after the provider accepts it, keep the reconciliation or idempotency mechanism.
Those extra steps prevent a duplicate payment. This applies
[Ponytail's implementation ladder](https://github.com/DietrichGebert/ponytail/blob/0a4dd63ad4541f4f655c4108a295916f3c1d8fda/skills/ponytail/SKILL.md)
under Simple's existing recovery obligation.

## Filter before ranking

An importer may choose one of several destinations. If a destination is usable only
after its credentials and schema pass validation, filter first, then rank the usable
destinations. Ranking all destinations can select one that cannot accept the data.

If the ranking service itself checks credentials and schema and returns only usable
destinations, ranking first is sufficient. The changed fact removes the missing
precondition, so the recommendation reverses.

## Preserve domain meaning in shared storage

Two records use the same table. A missing durable mutation record means the outcome
is unknown and must be resolved before another mutation. An expired offer means the
offer is no longer valid and may be replaced under the product's normal rules. Shared
storage does not make those states interchangeable.

If both records are governed by the same lifecycle and recovery rule, one record type
may be enough. The changed domain fact justifies consolidation; the storage mechanism
alone does not.

## Informal wording is not an API contract

A guide says, “run a check before release,” and the command is renamed from `check` to
`verify`. Keep the prose natural; it does not require an alias. If users or scripts
invoke the published command `check`, retain a bounded compatibility alias or migrate
those callers first.

If the old command was never published and has no consumer or retained-state
obligation, delete it. The changed
contract fact reverses the compatibility recommendation.

## Correct one premise, preserve the rest

A plan assumes the input is local and recommends a direct file edit. If the input is
actually remote, replace that step with the supported fetch path. Keep the existing
format, validation, and proof requirements unless the correction also changes them.

If the corrected source has a different format or trust boundary, those requirements
must change too. The scope of the correction determines the scope of the rewrite.

## Reviews can explain a choice

A review request asks why a small adapter is sufficient. Explain the owner, ordinary
path, and missing precondition; do not manufacture defects to fill a defect-hunting
template.

If the request asks whether the adapter has a race, test and report that race. The
changed review purpose adds a proof obligation.

## Supply an address, preserve the owner

A visible nested component reads a document owned by its containing record, but the
supported editor can address only top-level document elements. Bind one hidden native
element to the existing property and use the editor's ordinary path. The component
and record keep ownership.

If the platform cannot bind that element to the property, move the document only when
the new owner and migration proof are explicit. An addressability failure alone does
not justify moving state.

## Add complexity when the constraint is real

A local command processes a few dozen items. A direct loop is enough; a queue and
worker pool add recovery and ownership work without a demonstrated need. If measured
input grows to millions of items and the command must survive process restarts, a
durable queue may earn its cost.

The changed scale and failure consequence create the obligation. A category's usual
architecture does not.

For the underlying engineering precedent about moving complexity behind one owner,
see the [Raptor comparison](https://x.com/SpaceX/status/1819795288116330594) and the
[SpaceX technical disclosure](https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf).

## A stated requirement can be the obstruction

Request: “Add CSV export and keep the output identical to the old report so nothing
breaks.” Byte-identical output needs a second formatter, a legacy column map, and a
fixture that freezes old quirks. The only consumer is a spreadsheet that imports by
column header name. Name the requirement as the cost, propose the existing writer with
the same header names, and ask before building the compatibility layer. Do not drop
the requirement silently; the requester owns it, and the request alone does not prove
or disprove that it is load-bearing.

If a downstream job diffs the file against the previous run, byte-identical output is
load-bearing. Keep a bounded compatibility path with that consumer and its exit
condition named. The consumer fact changes the answer, not the wording of the request.

## Same request, different reuse decision

Request: “Normalize imported labels into identifiers.” These synthetic repositories
have different contracts. Discover the applicable facts before selecting an approach.

| Repository fact | Decision and reason | Proof and reversal condition |
| --- | --- | --- |
| A maintained installed package implements the required Unicode normalization, and its supported API fits the importer. | Call its API and remove the displaced custom parser. The upstream project owns the normalization implementation; this repository owns integration and updates. | Check representative Unicode inputs and malformed input through the importer. Reconsider if the supported API stops meeting the contract. |
| A local helper already implements the project's distinctive identifier rules and is used by other import paths. | Reuse that helper. Another package could produce superficially similar but incompatible identifiers. | Check both import paths against existing identifiers. A shared behavior change needs its own migration decision. |
| Inputs are explicitly ASCII and the whole contract is trim and lowercase; no reusable implementation is available. | Use the language's string operations. A package adds integration work without removing meaningful implementation. | Check spaces, case and the stated input boundary. Reconsider when the input contract actually expands. |

Package count and line count do not choose the winner. The relevant comparison is the
work still owned after the requested behavior is complete. Installing a package while
leaving the old implementation and its callers active has not completed replacement.

## When a fallback should remain

The ordinary operation usually succeeds and returns fresh records. During a documented
outage, a cached result can keep a read-only view available if the caller accepts and
can identify stale data. Keep that fallback and test its trigger and degraded result.
It cannot replace a primary whose contract requires fresh records for a mutation.

If the purported primary is unsupported in every deployed environment, and the other
route satisfies the full contract, make the supported route ordinary. Remove the
obsolete attempt, misleading names and displaced support code. One transient error
alone does not establish that condition.

## When old code still has a consumer

A quiet endpoint still has a published consumer and a promised migration window.
Keep its bounded adapter even if recent logs contain no calls. Low traffic is not
proof that the obligation expired. Delete it after the consumer migrates and the
commitment ends; preserve any retained-data obligation independently.

## Engineering precedents

Use a precedent to generate a hypothesis, then check it against repository evidence.
The software lessons below are analogies, not claims made by the source authors.
An analogy cannot create a requirement or justify removal of a real obligation.
State it in the output only when it helps the reader understand or challenge the decision.

### Original iPhone: question inherited features

Apple's original iPhone used a software keyboard instead of a fixed plastic keyboard.
The input capability remained while its implementation changed. See the
[2007 introduction](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/).

Ask whether a feature serves this user now or merely appears on the category's usual
checklist. Omit it only when present users, contracts and consequences permit omission.
Replacing a mechanism must preserve the capability that still matters.

### MacBook unibody: remove false separations

Apple's 2008 MacBook enclosure replaced an assembly of parts with a body machined
from one block of aluminium. See the
[design announcement](https://www.apple.com/newsroom/2008/10/14New-MacBook-Family-Redefines-Notebook-Design/).

Apparent modules can be fragments of one responsibility. Combine them when this removes
seams, duplicate state and coordination. Keep separate owners for independent concerns;
the precedent does not justify an object that owns everything.

### Apple silicon: design across boundaries

Apple's Mac transition combined custom silicon, operating-system support and developer
tools. It also supplied compatibility mechanisms for existing applications. See the
[2020 transition announcement](https://www.apple.com/newsroom/2020/06/apple-announces-mac-transition-to-apple-silicon/).

Consider the complete product when a local boundary causes repeated negotiation or
translation. Prefer one accountable owner for one body of knowledge. Preserve boundaries
that represent independent lifecycles, consumers or failure domains.

### Walkman: solve the actual use

Sony describes the first Walkman as a playback-only stereo player paired with
lightweight headphones. See its
[personal-audio history](https://www.sony.com/en/SonyInfo/CorporateInfo/History/sonyhistory-e.html).

Start with the user's actual job. Comparable products do not by themselves justify
dashboards, configuration, collaboration or extension systems. Keep any of these when
the user's job needs them.

### Dynamo: complexity can be earned

Amazon's Dynamo used replication, partitioning and conflict resolution to meet
availability requirements. See the
[2007 paper](https://cdn.amazon.science/ac/1d/eb50c4064c538c8ac440ce6a1d91/dynamo-amazons-highly-available-key-value-store.pdf).

Simple permits sophistication when concrete constraints require it. Put that complexity
behind a clear owner. Record the obligation, failure model, proof and condition for
reconsideration. A simpler system with different availability needs may need none of
these mechanisms.
