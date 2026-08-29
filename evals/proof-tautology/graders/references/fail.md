Keep the calculation in the test so it always follows production accurately:

```js
const expected = Math.round((subtotal + subtotal * VAT_RATE) * 100) / 100;
assert.equal(total(subtotal), expected);
```

Add a separate assertion that `VAT_RATE` is a number. This gives both the formula and
constant direct coverage.
