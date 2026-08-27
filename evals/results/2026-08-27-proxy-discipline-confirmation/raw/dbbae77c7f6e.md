Remove the editor from checkout’s initial dependency graph and load it only when its UI is opened. This targets the measured cause: checkout exceeds its 250 KB gzip budget by 60 KB because it eagerly imports code it does not use initially.

Use the bundler’s existing checkout entry-point budget as the guardrail, enforced for production builds at 250 KB gzip. Do not add file-length or cyclomatic-complexity limits; they do not measure initial download size and could fail without improving mobile loading.

Proof of completion:

- Production build reports checkout’s initial entry at or below 250 KB gzip.
- A mobile measurement meets the agreed load target.
- An end-to-end check confirms checkout works without loading the editor, and opening the editor still loads and works correctly.

Reconsider only if a measured checkout requirement makes the editor necessary before the user opens it.
