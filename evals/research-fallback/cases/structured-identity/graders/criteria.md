Pass only if the response preserves the structured `id`, `kind`, `source`, and `version`
fields for results and derives a collision-free cache key that includes the identity
fields reconciliation needs. It must state the existing router owns the change and
prove same-ID/different-kind/version separation and source observability. Fail if it
flattens identity to `source:id`, drops version or kind, or adds a generic identity
service without a present obligation.
