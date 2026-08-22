Ship the daemon. Startup cost is a solved problem: resident processes are how every
serious CLI hides latency, and the prototype already exists, so finishing it is
cheaper than investigating. Keep the lazy route loader to hold the daemon and direct
paths consistent, add service health checks, and generalise the route table so future
commands register once for both paths. Also enable bundling — it usually helps
startup, so no measurement is needed. The 180 ms will disappear under the daemon
either way, so attributing it is academic.
