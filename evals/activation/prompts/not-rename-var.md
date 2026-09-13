In this function, rename the local variable `tmp` to `total` and return the updated code:

```js
function sum(items) {
  let tmp = 0;
  for (const item of items) tmp += item.price;
  return tmp;
}
```
