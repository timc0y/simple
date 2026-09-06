import { hasLegacyCapability } from './capability.mjs';
import { runLegacy } from './legacy.mjs';

export function run() {
  return hasLegacyCapability() ? 'supported-ok' : runLegacy();
}

console.log(run());
