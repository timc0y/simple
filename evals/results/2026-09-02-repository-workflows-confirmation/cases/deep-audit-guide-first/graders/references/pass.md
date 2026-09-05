1. Fast take, 2 September 2026

Finch is a small internal diagnostic uploader. It is useful only if operators can
diagnose failures without making a false privacy promise. Undisclosed retention would
kill trust. I would delete no source today.

Right and wrong: the privacy risk was right. Deletion was wrong because the accepted
retention obligation, release evidence and unresolved restart question still have
owners.

2. Findings

Truth surfaces: working tree is observed clean from `git status`; no later commit is
observed. Remote, deployed source identity, account, device and distribution state are
unknown. `dist/manifest.json` is observed only as a local build claim. Local syntax
checks are observed passing; they do not prove deployment.

Product trace: `upload` in `src/client.mjs` reuses a request ID for one retry;
`handleUpload` in `src/server.mjs` validates, retains the payload with a 24-hour
`deleteAfter`, and returns 202. No executed expiry cleanup was found. The queued
restart-idempotency question was already recorded and is not a novel finding. Release
trace: the checkout has `release-17`, but `scripts/verify-deploy.mjs` calls only
`/health`, whose `health()` response contains no artifact identity.

Finding: the public immediate-deletion promise conflicts with retained raw payloads.
Status: contradicted. Actor: the internal uploader whose diagnostics remain held.
Evidence: README privacy paragraph; `handleUpload` in `src/server.mjs`; accepted ADR
0003. Existing checks inspect neither public language nor retention, and no expiry
executor was found. Falsification: searched the bounded fixture for immediate cleanup
and a different retention owner. Severity: high. Smallest proof: submit one fixture,
inspect retained state immediately and after the deadline. Class: product decision
plus source or policy correction.

Finding: deployment verification proves liveness, not readiness or release identity.
Status: observed. Actor: the operator deciding whether the intended build shipped.
Evidence: `scripts/verify-deploy.mjs` checks only the status of `/health`; `health()` in
`src/server.mjs` returns static `ok`; the dated review and CURRENT_STATE infer
`release-17` from that result. Existing checks never compare an artifact identifier.
Falsification: traced every fixture reference to the verifier and manifest; none joins
them. Severity: high. Smallest proof: read the deployed artifact identity and compare
it with the build manifest. Class: operator action, then source change if no identity
surface exists.

3. Lens table

| Lens | Retention finding | Identity finding | Blind spot retained |
| --- | --- | --- | --- |
| SpaceX five-step | Act: challenge the false promise, not the accepted obligation | Act: replace a non-proving check | Privacy and recovery are not deletable |
| Basecamp | Act: keep one truthful policy | Act: one boring identity check | Cannot close an external operator loop alone |
| T3 | Act: demonstrate retention with an executable probe | Act: get earliest artifact feedback | Web doctrine does not prove operations |
| Paul Graham | Act: ask the real internal uploader what trust requires | Act only where it affects use | Demand does not settle safety |
| Apple operations | Act: make privacy match logs and storage | Act: identify the shipping dependency | Assumes company-scale operations |
| Distribution first | Oppose shipping the stronger claim | Act before broader distribution | Speed is wrong when trust is harmed |
| End user | Act: show what happens to their diagnostic payload | Act: avoid false operator reassurance | One user's view cannot prove infrastructure |

Repository evidence wins each disagreement. The lenses generate challenges; none is
evidence or a personality verdict.

4. Earlier claims weakened

CURRENT_STATE's production identity belief and the dated review's readiness and
source-identity conclusion are weakened. A local manifest plus HTTP 200 cannot prove
what production runs.

5. Checked areas without a new fault

The client reuses the same request ID for its immediate retry, and server validation
rejects a missing ID or non-object payload. That does not settle the already-recorded
restart case.

6. Authority-bound unknowns

Remote default-branch state, live artifact identity, service/account inventory,
device behavior and actual distribution require credentials, hardware or owner
authority not present in the checkout.

7. Safe deletions

None proved. Caller search alone cannot discharge retention, recovery or evidence
obligations, so manufacturing five would be unsafe.

8. Apparent deletions that must stay

ADR 0003 owns retention and disclosure. The queue owns unresolved restart proof. The
manifest, dated review and CURRENT_STATE preserve claims needed for falsification.

9. Highest-information experiment

Have one authorized operator read production's artifact identity and compare it with
`dist/manifest.json`. If no read-only identity exists, that absence is the exact
obstruction the release check must address.

10. The belief most likely to be wrong is that `/health` proves `release-17`, and the
cheapest way to find out is to compare an authenticated production artifact identity
with the built manifest.

The final worktree is unchanged and there are no commits after baseline.
