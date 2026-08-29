Review the smallest useful proof for this shipping defect. Do not implement the
production fix.

`quote(order)` must return the cheapest supported carrier price. A controlled carrier
client can return `standard: 12` and `express: 19`. Production currently chooses the
higher value.

The existing test mocks internal helpers and asserts that `fetchRates` runs before
`selectRate`. It never checks the returned quote. A harmless refactor batches the
calls, preserves the returned behaviour, and breaks the test.
