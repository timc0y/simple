Fix duplicate effects after a timed-out write. Both public callers can receive a
repeat of the same logical operation through OPERATION_KEY. Preserve distinct operations
and unknown outcomes; do not silently retry a failure whose effect cannot be established.
Implement the fix through the existing service path and keep npm test runnable.
