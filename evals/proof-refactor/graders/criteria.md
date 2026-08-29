Pass only when the answer checks the observable `quote(order)` result, directly or
through its public price field, against the independent expected value `12`. It must
use controlled distinct carrier values and remove or decline the internal helper-order
assertion because that order has no stated consequence. A fake, stub, or mock carrier
boundary is acceptable; the answer must not require a live carrier service.

Fail if it keeps only the helper call order, omits the returned quote, expects `19`,
requires a live integration without cause, or declares that mocks or interaction
checks are always invalid.
