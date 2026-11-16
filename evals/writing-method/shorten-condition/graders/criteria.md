Pass a note of at most 45 words that preserves all four relationships: retry is
allowed only after the destination confirms no rows were stored; a timeout does not
establish that outcome; unknown destination results require waiting for
reconciliation rather than retrying; retry after storage risks duplicates. The last
source sentence is redundant and may go. Wording may vary.

Fail if the rewrite omits the retry prerequisite or the wait instruction, treats a
timeout as proof of no write, reverses a condition, or adds an unsupported action.
A response can contain only true statements and still fail by omitting the
decision-changing condition. Returning the original unchanged fails the requested
length improvement. Count ordinary whitespace-separated words; Markdown punctuation
does not create extra words.
