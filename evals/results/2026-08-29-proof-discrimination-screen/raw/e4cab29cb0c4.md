```js
const subtotal = 19.99;
const expected = 23.99;
assert.equal(total(subtotal), expected);
```

The original test derives `expected` using the same incorrect `VAT_RATE` as production, so both calculations agree despite the defect. Hard-coding the contract-based result makes the test fail until VAT is correctly set to 20%.
