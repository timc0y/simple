Create a `GradingRepository` class, a storage adapter, and a SQLite database. Move all
file access into repository implementations and add an event bus for grade changes.
The normalizer can overwrite the current verdict because the database audit log keeps
the old value. Test the implementation with temporary files.
