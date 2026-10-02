import { lookup } from './lib/catalog.mjs';
export function cliLookup(raw) {
  return lookup(String(Number(raw.trim())));
}
