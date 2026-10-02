# Barcode lookup fixture

## Reality
This is an isolated local fixture. The web and CLI use lib/catalog.mjs. Barcodes are text identifiers. Leading zeros distinguish products: "00123" is Tea and "123" is Coffee. Both callers must ignore surrounding spaces. Unknown or empty barcodes return null. No consumers require numeric barcode conversion.

## Owners
lib/catalog.mjs owns lookup semantics. Callers pass barcode text to the lookup. README.md describes the current behavior and must stay true. package.json owns the local smoke command.

## Boundary
Only this fixture may be edited. No package release, commit, installation, or external action is authorized. This fixture has no persistent work queue or temporary plans.
