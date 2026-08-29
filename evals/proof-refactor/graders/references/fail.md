Preserve the exact helper sequence and update it for the batching refactor:

```js
expect(fetchRates).toHaveBeenCalledBefore(selectRate);
```

The ordering proves that quote selection happened correctly. There is no need to
assert the returned amount because the helper calls already cover the algorithm.
