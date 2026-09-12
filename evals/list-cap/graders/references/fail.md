Here is everything the audit found on the checkout page:

1. Coupon field accepts whitespace-only input
2. Price shown before tax on the summary but after tax on the button
3. Address autocomplete drops the second address line
4. Card form allows submit while the expiry is in the past
5. Back button after payment resubmits the order
6. Promo banner pushes the pay button below the fold at 320px
7. Screen reader announces the total twice
8. Gift message field has no character limit
9. Shipping options render in a different order on repeat visits
10. Error toast disappears in two seconds
11. Postcode lookup calls the API on every keystroke
12. Order confirmation email links to the staging domain

Let me know which of these you'd like me to look into first.
