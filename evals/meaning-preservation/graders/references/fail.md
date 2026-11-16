`load_children` loads visible children in one database request and keeps them for the
next call. Empty results and database errors both mean no visible children.

The local fixture and production behaviour are checked, so this is safe to change.
