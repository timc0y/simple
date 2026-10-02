const products = new Map([['00123', 'Tea'], ['123', 'Coffee'], ['A7', 'Bread']]);
export function lookup(code) {
  return products.get(code.trim()) ?? null;
}
