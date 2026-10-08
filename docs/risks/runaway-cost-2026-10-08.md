# Runaway-cost risk note — 2026-10-08

**Status:** source audit; live deployment/account controls not verified.

**Finding:** P3: manual model evaluation runs need total invocation/time budget; no hosted loop established.

**Required follow-up:** Verify live deployments, provider usage and enforceable limits before claiming this risk is closed. If this repository adds scheduled, queue, alarm, agent or paid-provider work, require an atomic allowance before side effects, cumulative attempts/age, concurrency bounds, idempotent child identity, bounded retention and a terminal stop. Preserve existing safeguards. No production changes are authorised by this note.

**Evidence:** [Cross-repository audit](https://github.com/timc0y/ops/blob/15a868960a5550ac740a7c8564f9fcaea6a9e9be/research/serverless-cost-audit-2026-10-08.md). This note is a risk record, not a claim of active billing loss or a completed fix.
