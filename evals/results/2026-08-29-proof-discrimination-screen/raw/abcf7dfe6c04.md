Add one behavior-focused test:

```js
it('returns the cheapest supported carrier price', async () => {
  carrierClient.getRates.mockResolvedValue({
    standard: 12,
    express: 19,
  });

  await expect(quote(order)).resolves.toBe(12);
});
```

This directly proves the defect: with controlled rates, `quote(order)` must return `12`, not `19`. Remove the assertions about internal helper calls and their order; batching or refactoring those calls should not affect this contract.
