import { readFile } from 'node:fs/promises';
const labels = JSON.parse(await readFile('labels.json', 'utf8'));
console.log(JSON.stringify(labels.map(label => label.trim().toLowerCase())));
