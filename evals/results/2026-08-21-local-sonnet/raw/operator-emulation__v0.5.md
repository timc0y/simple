# Daily emailed CSV report

## 1. Baseline Simple solution

**Requested outcome:** produce a CSV report from existing data and email it once a day to the operations team.

**Observed repository facts:**
- One internal TypeScript app, one operations team, no external consumers, no compatibility commitments outside the repository.
- The report module already owns report generation; the in-process job runner already owns scheduling and retries; the mailer already owns delivery; Zod already owns API input validation.
- Five reports already run each day; a failed run already retries safely.
- No production data schema changes.

**Preserve / replace:** preserve existing report output, retry behaviour, and API boundary validation. Nothing needs replacing — this is one more scheduled job, not a new subsystem.

**Existing owner and ordinary path:** the report module generates data, the runner schedules and retries, the mailer delivers. Add the CSV report as one more job through this existing runner.

**Smallest truthful design:** a job (in the existing runner) that calls the report module to get the day's data, formats it as CSV inline (a local formatting step, not a new module), and calls the existing mailer with the CSV attached. Schedule it the same way the other five daily reports are scheduled. Validate any external input (recipient list, report-date parameter) with the existing Zod schemas.

**Complexity avoided:**
- No queue service — one producer, one consumer, in-process; the runner already schedules and retries.
- No event bus — nothing else needs to react to "report generated"; the only consequence is one email.
- No report microservice — generation already has an owner and needs no network isolation for five daily jobs with safe retries.
- No custom schema language — Zod already validates the boundary; CSV output is a fixed shape, not a schema needing new machinery.

**Independent proof:** a focused job test (trigger and retry behaviour), a report-output test (CSV content matches source data), a type-check, and one integration run through the existing runner confirming the email sends with the correct attachment.

**Reconsider when:** measured load, isolation needs, delivery guarantees, or failure consequences exceed what the existing runner, mailer, and report module already handle.

## 2. Apply the SpaceX five-step doctrine

Sequence: question every requirement, delete the part or process, simplify or optimize, accelerate cycle time, automate.

1. **Question every requirement.** A queue service, event bus, report microservice, and custom schema language are not requirements — none trace to a named user, contract, or measured failure. They fail this step immediately.
2. **Delete the part or process.** Delete all four proposed components before designing anything. The report itself stays, since it is an already-established, already-running process.
3. **Simplify or optimize.** What remains: query, format as CSV, send email — using the existing report module, runner, and mailer, with no new abstraction layer.
4. **Accelerate cycle time.** Ship it as a small addition to the existing runner; no new deployment pipeline or service boundary to stand up first.
5. **Automate.** Only now wire it to the runner's existing daily schedule — automation is the last step, not the first design decision.

This lands on the same shape as the baseline: one scheduled job in the existing runner, reusing existing report and mailer code.

## 3. The doctrine's blind spot

The five-step order treats a proposed design; it does not itself establish who the users, operators, and consumers are, or what data and commitments already exist. It instructs you to delete unrequired parts but supplies no way to name the requester, the retained data, the compatibility commitments, or the real failure consequences — without that grounding, "question every requirement" has nothing to question against, and "delete the part" has no obligation to weigh before removing it. Applied alone, the same deletion instinct that removes the queue and microservice could just as easily remove the API boundary validation or the retry behaviour, both of which are proven-necessary obligations here. Simple's prior step — establishing users, operators, consumers, contracts, retained data, commitments, scale, and failure consequences — is what makes the doctrine's deletions safe. The doctrine assumes that grounding; it does not produce it.

## 4. Synthesized smallest truthful plan

Add one job to the existing in-process runner: reuse the report module to produce the day's data, format it as CSV, and call the existing mailer to send it — scheduled the same way the other five daily reports are scheduled, with any external input validated by the existing Zod schemas.

- No new service, process, queue, bus, or schema language — none corresponds to a present user, contract, or measured failure consequence, and each is explicitly excluded by the repository's "Preserve" and "Reconsider when" facts.
- Preserve, unchanged: existing report output, retry behaviour, and API boundary validation.
- Independent proof: a focused job test, a report-output test, a type-check, and one integration run through the existing runner — each exercises the runner's, mailer's, or report module's existing public surface, not the new job's internal code path, so it verifies behaviour independent of the design proposal itself.
- Reconsider only if measured load, isolation, delivery guarantees, or failure consequences exceed the existing runner — not before.
