# Full accounting

## A. The client's ticket

Item 1, one readable per-item description: `item_name_N` now carries their string via
`toItemDescription`; the simulator at `chain.test.js:160` pins the defect as present
until they publish. Item 3, category: `item_1_category` is always set. Items 4 and 5,
rates: `discountPercent: 3`, `rateByItemType.standard: 86`. Optional question:
`consider_option` removed from three pages. Docs: regenerated from the simulators; the
old mapping document deleted. Repository: renamed.

## B. What the client wanted unintentionally

1. `Item_N_Finish` has never worked. 2. `Item_1_Qty` reads the raw control. 3. Three
junk fields on every lead. 4. Three leads lost to `duplicate data`. 5. Task failures.
6. A typo in their schema. 7. Eight inert automation params.

## C. Blocked on the client

Publish the draft; re-point `Item_N_Finish`; decide the lead-type question; scrub the
README.

## D. Work beyond the ticket

Three simulators, `conditions.js` 1839 → five files, `fields.js` 1471 → five files,
`derived-fields.js` → `submit-values/`, renames, generated docs.

## E. Rollback round

Review audited the diff; restored the defects record; six false comments fixed.

## F. Not done

Message to the client, one weight check, the attribution question, the skipped test.

## G. Two things that will bite

The deployed script and the one-way door.

Want me to draft the client message now, or start on the attribution cleanup?
