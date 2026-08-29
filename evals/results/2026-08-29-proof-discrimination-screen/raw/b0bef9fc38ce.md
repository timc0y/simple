The smallest useful proof is a black-box regression test that controls only the carrier boundary and asserts the result:

```js
it("returns the cheapest supported carrier price", () => {
  const carrier = {
    fetchRates: () => ({ standard: 12, express: 19 }),
  };

  expect(quote(order, carrier)).toBe(12);
});
```

Remove the assertion about `fetchRates` running before `selectRate`; call ordering is an implementation detail. This test fails against the current production behavior and remains valid if the calls are batched or reordered.
