Turn on the 300-line rule and split `billing.ts` into three similarly sized helper files.
The smaller files satisfy the metric, so the existing tax and notification ownership
does not need to affect the design. Unit-test each new helper.
