Recommendation: do not add the vendor queue now.

The in-process owner meets current needs: p95 latency is 7 minutes against a 10-minute target, and the last 200 deployments had no queue-related failures. The queue proposal is based only on possible traffic doubling next year.

Material unknown: regional failover behavior has not been tested. Run the failover drill before revisiting the decision.
