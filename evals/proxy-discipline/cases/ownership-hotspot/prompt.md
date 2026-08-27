Advise the maintainer before they change the repository.

`billing.ts` is 620 lines. It validates invoices, calculates tax, and renders billing
emails. Existing tax and notification modules already own the other tax and email
behaviour. During the last six changes, unrelated tax and email edits caused four merge
conflicts, and two tax fixes also required unrelated email snapshot updates.

A teammate proposes only enabling a 300-line file limit. Recommend the smallest change
and its proof. Do not write code.
