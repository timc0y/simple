## The reply that did not return

A one-shot CLI sends mutations to a remote system. It normally verifies each result
with a fresh read. Occasionally the connection disappears after the request leaves
the process but before a response or readback arrives. The remote mutation may have
landed. Retrying some operations can create a duplicate or apply a change twice.

There is one trusted operator and one installation. Each command currently exits
without retaining workflow state. A process lock already prevents simultaneous
mutations, but it disappears when its process is gone. Reads are safe and are needed
to inspect the remote system after uncertainty.

Design the smallest truthful recovery model. State what must survive process exit,
which operations remain available, who may clear the condition, how malformed
recovery state behaves, and what owns enforcement.
