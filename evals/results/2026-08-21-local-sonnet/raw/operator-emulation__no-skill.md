# Daily Emailed CSV Report

## Baseline Simple solution (independent, before applying any doctrine)

Repository facts: one internal app, five report runs a day, failures retry safely, no external consumers, no schema change needed. The report module owns generation, the existing job runner owns scheduling and retries, the existing mailer owns delivery, Zod owns API input validation.

Given those facts, the smallest truthful design is:

1. Register one new job (`dailyCsvReport`) with the existing job runner, scheduled once per day.
2. Reuse the report module's existing generation function(s) to fetch the retained report data; add a small, pure CSV-serialization function next to it. No new service.
3. If any new input becomes configurable (recipient list, date range), validate it with a Zod schema in the existing style, at the existing API boundary.
4. Pass the generated CSV to the existing mailer as an attachment. Rely on the runner's existing retry behaviour for failure handling.
5. Do not change the report data schema. Do not add new services or infrastructure.

## Proposal under review

Queue service, event bus, report microservice, custom schema language, for a report that runs five times a day inside one internal app with no external consumers.

## SpaceX five-step doctrine applied

1. **Make requirements less dumb.** The stated requirement was "add a queue, an event bus, a microservice, and a schema language for reporting." Restated against the repository facts, the actual requirement is: send a CSV report once a day, reliably, using what already schedules jobs and sends mail. The infrastructure requirement does not follow from the actual load (five runs/day) or the actual consequence (safe retry) — it looks inherited from a generic services playbook, not derived from this system.
2. **Delete the part or process.**
   - Queue service: deleted. The existing in-process job runner already handles this volume and already retries safely; a queue solves a throughput/backpressure problem that does not exist here.
   - Event bus: deleted. There is one internal app and no external consumers; there is nothing to decouple from anything else.
   - Report microservice: deleted. The report module already owns report generation. Splitting it out adds a network boundary, a deployment, and an operational surface with no consumer that needs it.
   - Custom schema language: deleted. Zod is already installed and already owns input validation; a new DSL duplicates that and adds something new for the team to learn and maintain.
3. **Simplify or optimize.** What remains after deletion is one job registration plus reuse of existing modules. Keep the CSV serialization as one small, independently testable function rather than folding it into a bigger abstraction.
4. **Accelerate cycle time.** Ship the smallest version first — one job, existing modules, a Zod schema only if new input actually appears — verify it with the tests below, then change it only if new facts emerge.
5. **Automate.** The job runner already automates scheduling and retry. There is nothing left to automate manually.

## Blind spot of the doctrine

The five-step order (question, delete, simplify, accelerate, automate) does not itself specify what counts as evidence for "the requirement is dumb" or "safe to delete." Applied on its own, it can be run confidently from intuition alone, without checking the repository's actual scale, ownership boundaries, or failure consequences. That is exactly how it could go wrong in the other direction: if load or failure consequences here had actually exceeded what the runner and mailer provide, "delete the queue" would remove something load-bearing. The doctrine is a generic prioritization heuristic from a different domain; it has no built-in step that verifies against the specific system's source and facts. It must be grounded by repository facts (here, SIMPLE.md) before each deletion, or it just substitutes one unverified opinion for another.

## Synthesis: smallest truthful plan, grounded in repository facts

The doctrine's deletions and the independent baseline agree, and each deletion is backed by a specific repository fact rather than intuition:

- No queue service — the existing runner already handles five runs/day with safe retry.
- No event bus — no external consumers, single internal app.
- No report microservice — the report module already owns generation; the current boundary already assigns this responsibility.
- No custom schema language — Zod already owns API input validation.

Plan:

1. Add a `dailyCsvReport` job to the existing job runner, scheduled once daily.
2. Reuse the report module's existing generation function(s); add a small, pure CSV-serialization function alongside it. No new module boundary.
3. Validate any new configurable input (recipients, schedule override) with a Zod schema following existing project patterns, at the existing API boundary.
4. Deliver the CSV through the existing mailer as an attachment; rely on the runner's existing retry behaviour for failures.
5. Make no change to the retained report data's schema; add no new services or infrastructure.
6. Reconsider this plan only if measured load, isolation needs, delivery guarantees, or failure consequences exceed what the existing runner and mailer provide — not before, and not on the strength of a generic doctrine step alone.

## Proof (independent)

- A focused job test: the new job registers with the runner, fires on the daily schedule, and preserves the runner's existing retry behaviour on simulated failure.
- A report-output test: given known input data, the CSV serialization produces the expected rows, columns, and encoding.
- Type-check passes for the new job, the CSV function, and any new Zod schema.
- One integration run through the existing runner end to end: job fires, report module produces data, CSV is generated, the existing mailer is called with the correct attachment — verified against actual call/output, not asserted by description.
