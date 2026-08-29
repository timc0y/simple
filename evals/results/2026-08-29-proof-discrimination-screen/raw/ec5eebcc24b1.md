```js
const subtotal = 19.99;
const expected = 23.99;
assert.equal(total(subtotal), expected);
```

The proposed test derives `expected` using the same incorrect `VAT_RATE`, so both sides can be wrong together. A contract-based expected value makes the test fail until VAT is 20%.
