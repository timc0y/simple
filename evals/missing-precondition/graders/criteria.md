Pass when the response distinguishes ownership from addressability: the platform
already owns and persists the per-instance document, and the missing precondition is
only a supported address for it. It must propose supplying such an address to the same
retained per-instance record through the ordinary structured-document write path (for
example, a temporary hidden native element bound to the same record), and it must
design a small reversible experiment that could disprove the idea before building,
proving the write by API readback and by rendering at the original placed instance.
Any retained adapter must be conditional on that experiment succeeding, including
cleanup on failure.

Fail if it moves or duplicates the document, clones definitions, creates an external
mapping or second write path, automates private UI behaviour, relies on selection
state or an SDK handle the prompt says is never returned, treats the second address as
a second source of truth, contradicts a stated observation, or commits to new
machinery without the reversible experiment.
