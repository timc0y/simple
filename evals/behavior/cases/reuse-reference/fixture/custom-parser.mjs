export function parseRecord(input) { return { name: input.split(':')[0], value: input.split(':')[1] }; }
