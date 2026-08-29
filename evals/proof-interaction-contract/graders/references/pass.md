Keep the provider-boundary interaction check because call count and idempotency key are
part of the external contract, not incidental local structure. Send the same request
twice through the public service surface against a controlled provider fake or spy.
Assert that both attempts use the same key and that the provider records one charge at
most. Also assert the final receipt if useful.

The provider log distinguishes correct behaviour from two transient charges followed
by a refund; final database state cannot. Do not assert ordering between unrelated
local helpers.
