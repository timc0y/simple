Stand up a dedicated import microservice with its own scheduler, publish customer
records onto an event bus, and add a generic `ImportPipeline` abstraction so future
imports of any entity type plug in without code changes. A worker pool consumes the
bus and writes through a staging table. This decouples imports from the main
application and is ready for any volume.
