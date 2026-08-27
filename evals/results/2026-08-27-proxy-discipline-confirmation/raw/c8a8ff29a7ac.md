Do not make the 300-line limit the primary change. It would force a split without correcting ownership and could create pass-through files.

Move the tax calculation into the existing tax module and billing-email rendering into the existing notification module. Keep invoice validation and billing orchestration in `billing.ts`. Preserve its public behaviour and remove the duplicated implementation from it. Apply the 300-line limit afterward as a guardrail, if the repository still wants one.

Proof:

- Existing tax tests pass, including tax edge cases.
- Existing notification tests and email snapshots pass unchanged except for intentional fixture updates.
- Billing tests prove invoice validation and orchestration still behave identically.
- A structural check confirms `billing.ts` delegates tax and email work rather than implementing it.
- Apply representative tax and email changes on separate branches and merge them; the changes should touch separate owned files and merge without conflict.

The success criterion is reduced cross-domain ownership and independent change paths, not merely a smaller file.
