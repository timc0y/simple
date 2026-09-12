# Plan

## Outcome

Add a monthly usage CSV export whose bytes match the retired report’s contract:

- 14 columns in the fixed legacy order
- two preserved empty legacy columns
- the existing `Total` footer row
- Windows line endings
- unchanged quoting, formatting, and field values from the old report

The nightly reconciliation job must continue reading the file by column position without changes.

## Existing owner and obstruction

The application’s existing export path owns CSV generation and is already used by two exports. Its writer emits only a header row and data rows, so it cannot satisfy the legacy footer and layout contract by configuration alone.

The obstruction is representation compatibility, not data production. The application should continue to own the report data and export entry point, while a bounded legacy formatter supplies the required file representation.

## Design

Reuse the existing export flow and CSV-writing machinery where its behaviour matches the old report. Add one report-specific formatter or writer configuration that owns:

- the 14-column legacy map
- the two intentionally empty columns
- the legacy header and row ordering
- the `Total` footer
- Windows line endings
- any legacy quoting or value formatting required by the reference output

Do not change the shared writer’s default behaviour, because the other exports depend on header-plus-data output without a footer.

## Implementation steps

1. Locate the existing monthly usage data owner and export entry point. Confirm that the new export uses the same data and aggregation rules as the retired report.

2. Obtain a canonical old report file and record its exact observable contract: column names and positions, empty-column positions, field formatting, quoting, encoding, footer contents, and line endings. If no canonical file survives, this is a blocker because “identical” cannot be proved from the column count alone.

3. Add the legacy column map and report-specific formatter at the existing export boundary. Populate the two legacy columns explicitly as empty values and append the `Total` row after all data rows.

4. Configure the output to emit CRLF line endings and preserve the old file structure. Keep the compatibility logic local to this export.

5. Add a byte-level golden fixture based on the canonical old report. Include rows that exercise empty values, quoting, totals, and the two empty legacy columns.

6. Add a consumer-shaped test that reads the generated file by column position and verifies the expected values. This represents the nightly reconciliation job’s actual dependency without changing that repository.

7. Verify that the two existing exports retain their current output: header row, data rows, no footer, and their existing line-ending behaviour.

## Proof

The fixture test must compare the complete generated file with the canonical bytes, including CRLF endings and the final `Total` row. Separate assertions should verify:

- exactly 14 columns per row
- stable positions for both empty legacy columns
- stable footer placement and values
- unchanged data and total calculations
- unchanged output for the other two exports

A byte-for-byte comparison is the independent proof that the implementation has not merely produced a semantically similar CSV.

## Complexity avoided

This keeps one data owner and one normal export path. It avoids changing the reconciliation job, adding a second data pipeline, changing the shared writer for unrelated exports, or maintaining duplicate report state.

The legacy formatter is justified by the real downstream consumer and the explicit byte-compatible output requirement.

## Risks and reconsideration

The exact legacy column map and formatting rules are not included in the known facts. They must come from a surviving report, historical fixture, or equivalent authoritative artifact.

If the old output cannot be recovered, the compatibility requirement cannot be verified. In that case, confirm which parts of the format are authoritative before implementation; do not silently substitute a newly invented 14-column layout.
