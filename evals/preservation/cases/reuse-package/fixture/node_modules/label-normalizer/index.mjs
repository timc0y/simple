export function normalizeLabels(labels) {
  return labels.map(label => label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
}
