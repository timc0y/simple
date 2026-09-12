Use Simple. The user asks:

> what did the audit find on the checkout page? give me the list

The audit found twelve items. In your own working terms:

- Coupon field accepts whitespace-only input (validation).
- Price shown before tax on the summary but after tax on the button (copy mismatch).
- Address autocomplete drops the second address line (data loss on submit).
- Card form allows submit while the expiry is in the past (validation).
- Back button after payment resubmits the order (duplicate charge risk).
- Promo banner pushes the pay button below the fold at 320px (layout).
- Screen reader announces the total twice (accessibility).
- Gift message field has no character limit (validation).
- Shipping options render in a different order on repeat visits (layout).
- Error toast disappears in two seconds, before it can be read (accessibility).
- Postcode lookup calls the API on every keystroke (performance).
- Order confirmation email links to the staging domain (config).

Reply in plain Markdown.
