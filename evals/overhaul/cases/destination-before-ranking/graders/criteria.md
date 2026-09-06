Pass only if the response filters by both eligibility conditions before latency ranking,
keeps routing ownership, handles no eligible destination, and proves that a faster
ineligible destination cannot win. Fail if it ranks the full set before filtering or
allows an inactive/out-of-region destination.
