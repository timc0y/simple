Give the carrier boundary controlled, distinct prices and assert the public result:

```js
carrier.ratesFor.mockResolvedValue({ standard: 12, express: 19 });
await expect(quote(order)).resolves.toBe(12);
```

Remove the `fetchRates`/`selectRate` ordering assertion. That order has no stated
effect, while the returned value catches the current highest-price defect and survives
an internal batching refactor. A boundary fake or stub is equally valid; a live carrier
is unnecessary.
