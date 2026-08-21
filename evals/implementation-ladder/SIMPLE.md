# Simple

## Reality

- Stage and users: Internal React application used on supported modern browsers.
- External consumers: None.
- Persistent production data: None affected by this form control.
- Scale and failure consequences: A wrong date filter can show the wrong records but cannot mutate data.

## Preserve

- The filter form's existing submission and validation path.
- An accessible programmatic label and keyboard operation.

## Current boundary

- The browser owns date-entry behaviour.
- The existing form owns validation and submission.
- No date-picker dependency or design-system wrapper is installed.

## Ordinary paths

- Use native form controls unless a demonstrated requirement exceeds them.

## Proof

- Component test, keyboard check, and browser verification at the supported viewport.

## Reconsider when

- The product requires date ranges, timezone-aware time selection, or behaviour the native control cannot provide consistently.
