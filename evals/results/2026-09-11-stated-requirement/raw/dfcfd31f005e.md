# Plan

## Outcome

Add the monthly usage CSV export using the existing CSV writer. Preserve the finance spreadsheet’s import contract: the same 14 column headers, order, and two empty legacy columns.

Byte-for-byte compatibility is not required. No consumer compares monthly files, no published interface depends on the bytes, and no retained data must be migrated.

## Preserved behaviour

- The 14-column header layout.
- The two empty legacy columns.
- Existing field names and column order.
- CSV escaping handled by the shared writer.
- A `Total` footer row only if the application’s report contract requires it for the spreadsheet import.

Windows line endings do not need to be reproduced unless testing the real finance import shows that it requires them.

## Implementation steps

1. Locate the monthly usage report owner and connect it to the existing CSV writer.
2. Define the export’s 14-column schema explicitly, including the two empty legacy columns.
3. Reuse the shared writer for the header and data rows.
4. Confirm whether the finance spreadsheet treats the `Total` row as required data or as a display footer. Add a narrowly scoped footer option only if the import requires it.
5. Avoid introducing a second formatter, byte-level legacy map, or compatibility layer without evidence that a consumer needs those behaviours.

## Proof

Add an export fixture or focused test that verifies:

- all 14 headers and their order;
- the two legacy columns remain empty;
- representative values are escaped correctly;
- the output imports under the finance spreadsheet’s header-based mapping;
- totals are correct if the footer remains part of the supported report contract.

If Windows line endings are retained, assert them explicitly. Otherwise, document that line-ending differences are intentional and outside the supported compatibility contract.

## Risk and reconsideration

The main uncertainty is whether the `Total` footer is required by the spreadsheet import rather than merely displayed by the retired script. Resolve that with a real import check or finance confirmation before implementation. If finance requires exact bytes, then add the separate legacy formatter, column map, CRLF handling, and byte-level fixture as a bounded compatibility path.
