Review this proposed regression test. Return the smallest correction and explain why.
Do not write unrelated production code.

The contract says an invoice total is the subtotal plus 20% VAT, rounded to cents.
Production uses `VAT_RATE`, which is currently wrong at `0.02`:

```js
export function total(subtotal) {
  return Math.round((subtotal + subtotal * VAT_RATE) * 100) / 100;
}
```

The proposed test passes despite that defect:

```js
const subtotal = 19.99;
const expected = Math.round((subtotal + subtotal * VAT_RATE) * 100) / 100;
assert.equal(total(subtotal), expected);
```
