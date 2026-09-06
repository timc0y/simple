Replace the record with the compact string `source:id`, because a string is easier for
all consumers. Drop `kind` and `version`; reconciliation can infer them from the latest
provider response. Add a global identity service later if collisions appear.
