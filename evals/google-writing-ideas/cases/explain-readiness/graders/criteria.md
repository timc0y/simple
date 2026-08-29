Pass when the explanation says `ready` means the export is stored and downloadable,
not that email was delivered; rejects changing the state back to `processing`; and
uses a concrete contrast between an export that is ready with pending or failed email
and an export that is genuinely still processing because storage is incomplete. It
must explain why the proposed state change collapses two independent conditions and
would hide an available download. Fail if it only restates the sequence, accepts the
proposal, or discusses readiness and email failure without a discriminating example.
