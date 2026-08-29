Use the contract's worked result instead of recalculating through production data:

```js
assert.equal(total(19.99), 23.99);
```

`23.99` comes from applying the specified 20% rate to `19.99` and rounding once. This
check fails while production uses `0.02`, but it remains valid if `total` is refactored
without changing its behaviour. Make it red first, then correct the production rate.
