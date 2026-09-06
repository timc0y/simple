First retain only destinations with `status=active` and `region=user_region`; then
choose the lowest `latency_ms`. The router owns this rule. With a faster inactive
destination and a slower active in-region destination, select the latter; with no
eligible destination, return the existing no-route outcome.
