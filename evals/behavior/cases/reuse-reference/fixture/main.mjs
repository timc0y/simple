import { parseRecord } from './custom-parser.mjs';
console.log(JSON.stringify(parseRecord(process.env.INPUT ?? 'name: Ada')));
