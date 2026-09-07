Our inventory service stores item_title in SQLite. Internal code should use label instead. The published HTTP API must keep returning item_title. No external process queries SQLite. Existing rows must survive.

Deployment A: one process, stopped while migration and application upgrade happen together. A backup can be taken before the change.

Deployment B: an older worker build queries item_title directly and must remain operational alongside the new build for 48 hours. Its query cannot be changed during that interval.

We maintain this ourselves. We do not need a PR queue, watcher, framework or a new service for this task.
