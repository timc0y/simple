Pass when the simpler explanation preserves all material relationships:

- `load_children` loads the current parent's children in one database request.
- Reuse lasts only for this call; the next call reads again.
- Only visible records appear.
- An empty result means no visible children; a failed request returns an error.
- The local fixture was checked; production remains unchecked.

Accept equivalent wording, including plain descriptions of reuse without the words
cache or memoisation. A topic mention alone is insufficient: saying "call", "error"
or "production" while reversing its relationship fails. Do not demand a particular
heading, sentence count or technical term absent from the source. Fail for a lost
condition, changed lifetime, swallowed failure, invented production verification or
an instruction to change the implementation. No command or file edit is requested.
