# Daily emailed CSV report

## Baseline Simple solution

Repository facts (SIMPLE.md): internal TypeScript app, one operations team, no
external consumers, no compatibility commitments outside the repo, five reports a
day with safe retries. The report module owns generation, the in-process job runner
owns scheduling and retries, the mailer owns delivery, and Zod owns API input
validation.

The missing capability is narrow: a scheduled task that produces a CSV and emails
it. Nothing about "daily," "CSV," or "email" implies a new service.

Plan: add a scheduled entry to the existing job runner that calls the report module
to generate the data, formats it as CSV, and hands it to the existing mailer. Add a
Zod schema for any new parameters (recipients, date range) alongside the existing
schemas. No new queue, event bus, microservice, or schema language — the runner
already handles scheduling and safe retries, and there is one process and one
consumer, so there is nothing for those parts to decouple or scale.

## Proposal under SpaceX's five-step doctrine

Doctrine: Everyday Astronaut, *Starbase Tour and Interview with Elon Musk* (2021,
checked 21 August 2026). Steps applied in order to the proposed queue service, event
bus, report microservice, and custom schema language.

1. **Challenge each requirement.** Queue service: no named requirement — nothing in
   the repository submits jobs faster than the runner processes them. Event bus: no
   named consumer — "External consumers: None." Report microservice: no isolation or
   independent-scaling need — one team, one app, five runs a day. Custom schema
   language: no cross-service or cross-language boundary — Zod already validates
   in-process input, and "Compatibility commitments: None outside this repository."
2. **Try hard to delete.** All four survive deletion. None has a named consumer, a
   retained-state obligation, or a measured failure the existing runner and mailer
   cannot already absorb. Deleting them removes four owners, four deployment
   surfaces, and a parallel validation format with no requirement behind it.
3. **Simplify what survives.** What remains after deletion is report generation, CSV
   formatting, and email delivery — each already owned. The only new code is a
   scheduled job entry, a CSV formatter, and one Zod schema.
4. **Accelerate only after the direction is correct.** Once the scheduled job and one
   integration run prove the CSV arrives correctly, there is no throughput problem to
   accelerate: five runs a day is far below the runner's capacity.
5. **Automate only once necessary, understood, and stable.** Scheduling through the
   runner is already the automation this work needs. Anything further (dedicated
   infrastructure, auto-scaling workers) is automation without a stable, understood
   process to justify it.

**Blind spot:** the doctrine's aggressive deletion is wrong where regulation,
retained data, public contracts, audit, security, accessibility, recovery, or
irreversible failure require explicit machinery. None of those apply here — the
change does not alter the retained report schema, there are no external consumers or
compatibility commitments, and a failed run may retry safely — so the blind spot does
not block deletion in this repository. It does mark the exact condition, stated in
SIMPLE.md's "Reconsider when," under which the deleted parts would need to return.

## Synthesis: smallest truthful plan

- Add a scheduled job to the existing runner that generates the report through the
  report module, formats it as CSV, and sends it through the existing mailer.
- Add a Zod schema for any new report parameters, next to the existing API schemas.
- Preserve existing report output, the runner's retry behaviour, and API-boundary
  validation, as required by SIMPLE.md.
- Do not add a queue, event bus, microservice, or schema language: none has a named
  requirement, and the existing owners already cover scheduling, retries, generation,
  delivery, and validation.
- Reconsider only if measured load, isolation needs, delivery guarantees, or failure
  consequences exceed what the existing runner provides — the condition SIMPLE.md
  already names.

## Independent proof

- A focused job test: the scheduled entry triggers report generation and calls the
  mailer on schedule.
- A report-output test: the CSV content and formatting are correct for known input.
- A type-check: the new schema and job code type-check cleanly.
- One integration run through the existing runner producing an actual emailed CSV
  end to end.

This proof exercises the runner's schedule and the mailer's output rather than
asserting the new code was called, so it distinguishes the requested behaviour —
a daily emailed CSV — from the implementation that produces it.
