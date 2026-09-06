import { readFile } from 'node:fs/promises';
import { normalizeLabels } from './custom-normalizer.mjs';

console.log(JSON.stringify(normalizeLabels(JSON.parse(await readFile('labels.json', 'utf8')))));
