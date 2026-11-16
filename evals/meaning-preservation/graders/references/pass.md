`load_children` gets the current parent's children in one database request. It keeps
that result for this call only and reads again on the next call.

It returns only visible records. An empty result means none are visible. If the
database request fails, it returns an error instead.

The local fixture was checked. Production behaviour is still unchecked.
