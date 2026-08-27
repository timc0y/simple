Recommend not adding the vendor queue now. The existing in-process pipeline serves one team, meets its 10-minute latency target with a 7-minute p95, and has completed the last 200 deployments without queue-related failures. The case for the vendor queue is only projected traffic growth next year.

Failover behaviour remains unknown because the regional failover drill has not run. Reconsider after measured load or latency shows the current owner is insufficient.
