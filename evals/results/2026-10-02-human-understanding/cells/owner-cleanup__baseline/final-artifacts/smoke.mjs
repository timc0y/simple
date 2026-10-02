import assert from 'node:assert/strict';
import { selectedDataset } from './src/selection.mjs';
assert.equal(selectedDataset(), 'moon');
console.log('selected dataset: moon');
