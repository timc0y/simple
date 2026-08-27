Moved the safety boundary into the mutation gateway in [SIMPLE.md](/tmp/simple-leading-words-codex-matrix-20260826/run/mutation-interval__gpt-5.6-terra__pony__r1/SIMPLE.md).

The gateway now owns lock recovery, receipt checks, remote mutation, uncertainty persistence, and only then unlocks. Receipt-write failure fails closed by retaining the lock. Included a real competing-process test that proves both race closures and the receipt-store failure path.
