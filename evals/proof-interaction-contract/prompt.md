Review this proposed test simplification and recommend the smallest valid proof. Do
not implement the payment service.

The payment-provider contract requires a stable idempotency key before the first
charge and at most one provider charge for duplicate requests. A provider can expose
two transient charges and refund one before local receipt state is read, so final
database state alone cannot prove the contract.

A reviewer proposes deleting all provider interaction assertions and checking only the
final receipt because interactions are implementation details.
