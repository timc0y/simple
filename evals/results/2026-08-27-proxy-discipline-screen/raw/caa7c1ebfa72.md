Set the bundler’s checkout entry-point gzip budget to 250 KB and fail the production build when it is exceeded. This is the smallest guardrail tied directly to the product requirement.

Do not add file-size or cyclomatic-complexity limits. They measure source shape, not the measured failure; a 140-line entry can still ship a 310 KB dependency.

Correction: remove the editor from checkout’s initial import path. Load it only in the editor flow that opens it.

Proof:

- The current production build fails at 310 KB.
- After the import correction, the build passes under 250 KB.
- Bundle output confirms the editor is absent from checkout’s initial chunk.
- A representative mobile session confirms the agreed load target is met.
