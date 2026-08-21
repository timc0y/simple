# Simple

## Reality

- Stage and users: Internal TypeScript web application used by one operations team.
- External consumers: None.
- Persistent production data: The application reads retained report data but this change does not alter its schema.
- Compatibility commitments: None outside this repository.
- Scale and failure consequences: Five reports run each day; a failed run may retry safely.

## Preserve

- Existing report output, retry behaviour, and validation at the API boundary.

## Current boundary

- The report module owns report generation.
- The existing in-process job runner owns scheduling and retries.
- The existing mailer owns delivery.
- Zod is already installed and owns API input validation.

## Ordinary paths

- Add scheduled report work through the existing runner.
- Reuse the report module, mailer, and Zod schemas.

## Proof

- A focused job test, report-output test, type-check, and one integration run through the existing runner.

## Reconsider when

- Measured load, isolation, delivery guarantees, or failure consequences exceed the existing runner.
