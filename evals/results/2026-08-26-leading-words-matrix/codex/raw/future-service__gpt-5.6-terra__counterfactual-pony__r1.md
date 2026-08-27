I wouldn’t add a service or queue yet. Reports are currently generated and persisted in-process for one local operator; no measured load or separate lifecycle requires another boundary.

Keep the report module as the owner. Revisit when measured load or an independent worker lifecycle exists.
