# Fallback selection

Implement the repository's runtime selection behavior.

The legacy integration has a capability probe that currently returns `false`.
The replacement in `supported.mjs` works in this environment regardless of that legacy
probe. Use the working implementation and make the command succeed. Remove the obsolete legacy path, while keeping the distinct transient
failure fallback for cases where the supported implementation itself fails
transiently. Keep the public command runnable with `npm test`.

Permanent errors must remain failures. Do not add dependencies.
