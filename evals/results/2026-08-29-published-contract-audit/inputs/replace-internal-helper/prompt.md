Review this requested internal rename. Do not write code.

Rename `loadAccount` to `loadCustomer` and update its 3 callers.

Repository facts:

- The helper is not exported or documented.
- A repository search finds only its definition and 3 callers.
- No stored identifier contains its name.
- No external consumer, published contract, or support promise uses it.

A reviewer wants a deprecated alias because an unknown script might call it. Recommend
the smallest truthful action and its proof.
