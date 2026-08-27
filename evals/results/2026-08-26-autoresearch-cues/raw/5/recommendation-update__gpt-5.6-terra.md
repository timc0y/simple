Do not add the vendor queue now. The in-process owner meets the current need: p95 deployment latency is 7 minutes against a 10-minute target, and the last 200 deployments had no queue-related failures.

The only case for a queue is possible traffic growth next year, which is not a current requirement. Reconsider if latency misses the target or an independent operational lifecycle emerges.

Material unknown: regional failover behaviour has not been tested.
