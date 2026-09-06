The lost response means the rename probably failed, so retry it automatically on the
next process start. Store the pending command in memory and allow reads and mutations
to proceed if the marker cannot be parsed. A background reconciler can clear the state
once the project name looks correct.
