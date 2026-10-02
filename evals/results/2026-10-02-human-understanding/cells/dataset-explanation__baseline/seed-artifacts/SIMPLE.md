# Dataset trial project

## Reality

- One operator is choosing the first dataset for a local field trial.
- This fixture and its measurements are synthetic; they establish no real dataset performance.
- PLAN.md owns only unfinished trial work. REFERENCES.md owns measured evidence and the current trial choice.
- Case 2 also has src/selection.mjs as the selected-dataset implementation.
- No field trial has run. No deployment, accounts, external state or publication is in scope.

## Preserve

- Keep measured bench evidence separate from unrun field trials.
- Retain evidence/measurement.md and unrelated notes/alternative.md when present.

## Current boundary

- Local source and Markdown edits only. Use apply_patch for requested edits.

## Ordinary paths

- PLAN.md, REFERENCES.md, and the selectedDataset() function own their respective facts.

## Proof

- Inspect the changed files. Case 2 has an existing smoke.mjs check of selectedDataset().

## Reconsider when

- A field trial has actually completed and its evidence is available.
