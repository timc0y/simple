# Passing reference

A passing plan keeps `reason_code` at the HTTP and PostgreSQL boundaries, renames the in-memory/domain property to `returnReason`, and maps between those names in the owned adapter/repository. It leaves the schema and reporting SQL alone, uses one stored value, and verifies JSON compatibility and old/new rolling coexistence. Equivalent minimal boundary designs also pass.
