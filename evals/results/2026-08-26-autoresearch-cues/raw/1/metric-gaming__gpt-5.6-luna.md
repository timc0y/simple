Keep the validation owner intact. The complexity is real decision logic: each branch enforces a current input rule, and there is no evidence that the module is hard to read or defect-prone.

Do not extract one-line helpers solely to satisfy Oxlint; that would move complexity around and scatter the validation rules. Choose an explicit repository threshold or add a narrow, documented exception for this owner. Reconsider a structural refactor only if review or defects show a genuine readability problem, or if the rules form a coherent reusable abstraction.
