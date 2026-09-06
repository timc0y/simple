export const normalizeLabels = labels => labels.map(label => label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
