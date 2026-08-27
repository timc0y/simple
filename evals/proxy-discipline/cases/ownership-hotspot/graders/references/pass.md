The problem is mixed ownership, not the number 620. Move tax calculation to the existing
tax module and billing-email rendering to the existing notification module. Keep invoice
validation and orchestration in billing. That removes the unrelated changes causing the
conflicts without inventing another layer. Run the current invoice, tax, email snapshot,
and billing integration tests through their public paths. A 300-line rule is not needed
to prove this correction.
