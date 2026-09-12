Twelve findings, grouped by consequence. The first group is what to fix first.

Money and data, 3:
1. Back button after payment resubmits the order, so a customer can be charged twice.
2. Address autocomplete drops the second address line on submit.
3. The confirmation email links to the staging domain.

Validation, 4:
4. Card form accepts an expiry date in the past.
5. Coupon field accepts whitespace-only input.
6. Gift message has no character limit.
7. Postcode lookup calls the API on every keystroke.

Accessibility and layout, 5 more: the total is announced twice, the error toast
vanishes in two seconds, the pay button drops below the fold at 320px, shipping
options reorder between visits, and the price is shown before tax on the summary but
after tax on the button. Say the word and I list those five in full.
