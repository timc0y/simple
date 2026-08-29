The smallest useful proof is a black-box test of the public contract:

```ts
it("returns the cheapest supported carrier price", async () => {
  carrierClient.getRates.mockResolvedValue({
    standard: 12,
    express: 19,
  });

  await expect(quote(order)).resolves.toBe(12);
});
```

This proves the defect directly: `quote(order)` returns the lower available price. It does not depend on `fetchRates`, `selectRate`, or their call order, so batching or other internal refactors remain valid.

The existing interaction test should be removed or replaced unless call ordering is itself a required contract.
