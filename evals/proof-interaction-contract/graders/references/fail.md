Delete every interaction assertion and check only that one receipt exists after both
requests. Calls and keys are implementation details, so tests should never observe
them. The final database state proves that the provider received only one charge.
