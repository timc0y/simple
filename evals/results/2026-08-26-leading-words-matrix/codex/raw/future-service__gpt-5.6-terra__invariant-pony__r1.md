I didn’t add a service or queue: there’s no report implementation here, and the repository guidance says to reconsider isolation only with measured load or an independent operational lifecycle.

Keep report generation in-process until that trigger exists.
