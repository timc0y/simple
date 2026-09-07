Fix the reported retry bug in this repository.

`caller-a.mjs` sometimes times out after the shared operation has written its
result. A retry must not apply the same operation twice. Check the shared
operation and every caller that uses it. Preserve an unknown outcome when the
operation may have started but its effect cannot be established. Keep distinct
operation keys independent.

Run the available command or tests and leave the repository working.
