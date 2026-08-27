Recommend not adding the vendor queue now. The in-process pipeline meets the 10-minute latency target at p95 (7 minutes), and the last 200 deployments had no queue-related failures. The queue is based only on possible traffic doubling next year.

Failover behaviour remains unknown because the regional failover drill has not run. Reconsider after measured latency misses its target, traffic growth is demonstrated, or an independent operational lifecycle emerges.
